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

// count tests
// one positive case - pass 
test("count: returns correct count when request succeeds", async () => {
    const mockResponse = [{}, {}, {}]; // simulate 3 addresses
    jest.spyOn(addressService, 'request').mockResolvedValueOnce(mockResponse);

    const result = await addressService.count({ body: {} });

    expect(result).toEqual({ count: 3 });
    expect(addressService.request).toHaveBeenCalledTimes(1);
});

// one negative case - fail 
test("count: rejects when request fails", async () => {
    const mockError = new Error('Request failed');
    jest.spyOn(addressService, 'request').mockRejectedValueOnce(mockError);

    await expect(addressService.count({ body: {} })).rejects.toThrow('Request failed');
    expect(addressService.request).toHaveBeenCalledTimes(1);
});