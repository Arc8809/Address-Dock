// this will test the function getDistance from address.service.ts

import addressService  from "../services/address.service";

// one positive case - Pass 
test("getDistance: Returns correct distance between London and Pairs", async () => {
    const london = { Latitude: 51.5074, Longitude: -0.1278 }; // London
    const paris = { Latitude: 48.8566, Longitude: 2.3522 };  // Paris

    const distance = addressService.getDistance(london, paris);

    expect(distance).toBeGreaterThan(340);
    expect(distance).toBeLessThan(350);
})

// one negative case - Fail 
test("getDistance: returns failing distance between London and Paris", async () => {
    const london = { Latitude: 51.5074, Longitude: -0.1278 };
    const paris = { Latitude: 48.8566, Longitude: 2.3522 };
  
    const distance = addressService.getDistance(london, paris);
  
    expect(distance).toBeLessThan(100); 
});