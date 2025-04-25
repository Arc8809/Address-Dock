import loggerService from "./logger.service";
type Location = { Latitude: number, Longitude: number};

class AddressService {
    private static fetchUrl = 'https://ischool.gccis.rit.edu/addresses/';

    constructor() { }

    public async count(addressRequest?: any): Promise<any> {
        return new Promise<any>(async (resolve, reject) => {
            this.request(addressRequest)
                .then((response) => {
                    resolve({
                        "count": response.length
                    });
                })
                
                .catch((err) => {
                    loggerService.error({ path: "/address/count", message: `${(err as Error).message}` }).flush();
                    reject(err);
                });
        });
    }

    public async request(addressRequest?: any): Promise<any> {
        return new Promise<any>(async (resolve, reject) => {
            fetch(AddressService.fetchUrl, {
                method: "POST",
                body: JSON.stringify(addressRequest.body)
            })
                .then(async (response) => {
                    resolve(await response.json());
                })
                .catch((err) => {
                    loggerService.error({ path: "/address/request", message: `${(err as Error).message}` }).flush();
                    reject(err);
                });
        });
    }

    public async distance(addressRequest?: any): Promise<any> {
        return new Promise<any>(async (resolve, reject) => {
            //use the "unit" parameter to request specifically kilometers or miles
            //return both if "unit" parameter is not there or it is something else other than these
            var unit: string;
            if(addressRequest.body["unit"] == "kilometers"
            || addressRequest.body["unit"] == "km") {
                unit = "kilometers";
            } else if(addressRequest.body["unit"] == "miles"
            || addressRequest.body["unit"] == "mi") {
                unit = "miles";
            } else {
                unit = "anything";
            }
            
            this.request(addressRequest)
            .then((response) => {
                //fails if the request does not pull up at least 2 addresses for comparing
                if(response.length < 2) {
                    loggerService.warning({ path: "/address/distance", message: "Search conditions did not match to at least 2 addresses." }).flush();
                    reject("Search conditions must match to at least 2 addresses");
                }

                const address1 = response[0];
                const address2 = response[1];

                var location1: Location;
                var location2: Location;
                location1 = {
                    Latitude: address1["latitude"],
                    Longitude: address1["longitude"]
                }
                location2 = {
                    Latitude: address2["latitude"],
                    Longitude: address2["longitude"]
                }

                var dist = this.getDistance(location1, location2);
                var distKM = dist;
                var distMI = dist * 0.621;

                if(unit == "kilometers") {
                    resolve({
                        "kilometers": distKM
                    });
                } else if(unit == "miles") {
                    resolve({
                        "miles": distMI
                    });
                } else {
                    resolve({
                        "kilometers": distKM,
                        "miles": distMI
                    });
                }
            })
            .catch((err) => {
                loggerService.error({ path: "/address/distance", message: `${(err as Error).message}` }).flush();
                reject(err);
            });
        });
    }

    public async getcity(addressRequest?: any): Promise<any> {
        return new Promise<any>(async (resolve, reject) => {
            //check required parameters
            if(addressRequest.body["zipcode"] == null || addressRequest.body.length > 1) {
                loggerService.warning({ path: "/address/getcity", message: "Bad input. Only zipcode parameter should be used." }).flush();
                reject("Getcity requires a zipcode attribute. Do not include any other attributes.");
            }
            
            this.request(addressRequest)
            .then((response) => {
                //fails if the zipcode doesn't exist or doesn't have any addresses in the web service
                if(response.length == 0) {
                    loggerService.warning({ path: "/address/getcity", message: "No city was found for the zipcode provided."}).flush();
                    reject("No city was found for this zipcode.");
                }

                const city = response[0]["city"];
                const state = response[0]["state"];

                resolve({
                    "city": city + ", " + state,
                });
            })
            .catch((err) => {
                loggerService.error({ path: "/address/getcity", message: `${(err as Error).message}` }).flush();
                reject(err);
            });
        });
    }

    public async numbers(addressRequest?: any): Promise<any> {
        return new Promise<any>(async (resolve, reject) => {
            //check required parameters
            if(addressRequest.body["state"] == null
                || (addressRequest.body["city"] == null && addressRequest.body["zipcode"] == null)
                || addressRequest.body["street"] == null
            ) {
                loggerService.warning({ path: "/address/numbers", message: "Bad input. Numbers requires these parameters: state, city OR zipcode, street."}).flush();
                reject("You may be missing some parameters. Make sure you include state, city OR zipcode, and street.");
            }
            
            var lowest: number;
            var highest: number;
            lowest = 999999;
            highest = 0;

            this.request(addressRequest)
            .then((response) => {
                //fails if the requested street has no addresses or doesn't exist
                if(response.length == 0) {
                    loggerService.warning({ path: "/address/numbers", message: "The requested street either has no addresses or does not exist." }).flush();
                    reject("This street has no addresses!");
                }

                for(let index = 0; index < response.length; index++) {
                    const address = response[index];
                    const number = parseInt(address["number"]);

                    if(number < lowest) {
                        lowest = number;
                    }
                    if(number > highest) {
                        highest = number;
                    }
                }

                resolve({
                    "lowest": lowest,
                    "highest": highest
                });
            })
            .catch((err) => {
                loggerService.error({ path: "/address/numbers", message: `${(err as Error).message}` }).flush();
                reject(err);
            });
        });
    }

    private getDistance(location1: Location, location2: Location) {
        // Defining this function inside of this private method means it's
        // not accessible outside of it, which is perfect for encapsulation.

        const lat1value = location1.Latitude;
        const lon1value = location1.Longitude;
        const lat2value = location2.Latitude;
        const lon2value = location2.Longitude;

        const toRadians = (degrees: number) => {
            return degrees * (Math.PI / 180);
        }

        // Radius of the Earth in KM
        const R = 6371;

        // Convert Lat and Longs to Radians
        const dLat = toRadians(lat2value - lat1value);
        const dLon = toRadians(lon2value - lon1value);

        // Haversine Formula to calculate the distance between two locations
        // on a sphere.
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRadians(lat1value)) * Math.cos(toRadians(lat2value)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        // convert and return distance in KM
        return R * c;
    }
}

export default new AddressService();