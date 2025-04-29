// this will test the function count from address.service.ts
import addressService from "../services/address.service";

beforeEach(() => {
    jest.clearAllMocks(); 
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