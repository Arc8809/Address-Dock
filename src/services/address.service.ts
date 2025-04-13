import loggerService from "./logger.service";

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
        // Complete this
        return new Promise<any>(async (resolve, reject) => {
            this.request(addressRequest)
            .then((response) => {
                const address1 = response[0];
                const address2 = response[1];

                var lat1 = address1["latitude"];
                var long1 = address1["longitude"];
                var lat2 = address2["latitude"];
                var long2 = address2["longitude"];

                var dist = this.getDistance(lat1, long1, lat2, long2);
                var distKM = dist.toString();
                var distMI = (dist * 0.621).toString();

                resolve({
                    "kilometers": distKM,
                    "miles": distMI
                });
            })
            .catch((err) => {
                loggerService.error({ path: "/address/distance", message: `${(err as Error).message}` }).flush();

            })
        });
    }

    private getDistance(lat1: string, lon1: string, lat2: string, lon2: string) {
        // Defining this function inside of this private method means it's
        // not accessible outside of it, which is perfect for encapsulation.
        const lat1value = parseFloat(lat1);
        const lon1value = parseFloat(lon1);
        const lat2value = parseFloat(lat2);
        const lon2value = parseFloat(lon2);


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