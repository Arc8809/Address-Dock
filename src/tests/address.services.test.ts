// this will test the function getDistance from address.service.ts

import addressService  from "../services/address.service";

describe("Address Service - Get Distance", () =>{
    // passing case
    it("returns distance in kilometers between two coordinates", async () => {
        const location1 = {
            // NY
            Latitude: 40.7128,
            Longitude: -74.0060
        };

        const location2 = {
            // LA
            Latitude: 34.0522,     
            Longitude: -118.2437
        };

        const distance = addressService.getDistance(location1, location2);

        expect(distance).toBeGreaterThan(3900); 
        expect(distance).toBeLessThan(4000);
    })

    // failing case
    it("throws an error when location data is incomplete", () => {
        const location1 = {
            // NY
            Latitude: 40.7128,
            // missing Longitude
        };

        const location2 = {
            // LA
            Latitude: 34.0522,     
            // missing Longitude
        };

        const result = addressService.getDistance(location1 as any, location2 as any);

        expect(result).toBeNaN();
    })

})



// // one positive case - Pass 
// test("getDistance: Returns correct distance between London and Pairs", async () => {
//     const london = { Latitude: 51.5074, Longitude: -0.1278 }; // London
//     const paris = { Latitude: 48.8566, Longitude: 2.3522 };  // Paris

//     const distance = addressService.getDistance(london, paris);

//     expect(distance).toBeGreaterThan(340);
//     expect(distance).toBeLessThan(350);
// })

// // one negative case - Fail 
// test("getDistance: returns failing distance between London and Paris", async () => {
//     const london = { Latitude: 51.5074, Longitude: -0.1278 };
//     const paris = { Latitude: 48.8566, Longitude: 2.3522 };
  
//     const distance = addressService.getDistance(london, paris);
  
//     expect(distance).toBeLessThan(100); 
// });
