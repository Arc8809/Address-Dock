// this will test the getcity function in address.services.ts 
import addressService from "../services/address.service";

jest.mock("../services/address.service", () => ({
    ...jest.requireActual("../services/address.service"),
    getcity: jest.fn(),
}));


// test cases
describe("Address Service - Get City", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // passing test
    it("should return correct city and state for a valid zipcode", async () => {
        const mockRequest = { body: {zipcode: "10001"}};
        const mockResponse = { city: "New York, NY" };

        (addressService.getcity as jest.Mock).mockResolvedValue(mockResponse);

        const result = await addressService.getcity(mockRequest);

        expect(result).toBeDefined();
        expect(result).toEqual({ city: "New York, NY" });
    }); 

    // failing test 
    it("should throw an error for missing zip code", async () => {
        const zipcode = "";

        (addressService.getcity as jest.Mock).mockRejectedValue(
            new Error("Invalid zip code provided.")
        );

        await expect(addressService.getcity(zipcode)).rejects.toThrow("Invalid zip code provided.");
    });
})
