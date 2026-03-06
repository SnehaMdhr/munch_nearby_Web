import { restaurantSchema } from "../restaurantowner/restaurantschema";

describe("restaurant schemas", () => {
  const smallImage = new File(["x"], "a.png", { type: "image/png" });

  it("rejects invalid map link", () => {
    const result = restaurantSchema.safeParse({
      name: "Spice Hub",
      address: "123 Food Street",
      mapLink: "not-a-url",
      phone: "9800000000",
      cuisine: "Nepali",
      image: smallImage,
    });

    expect(result.success).toBe(false);
  });

  it("rejects image above max file size", () => {
    const bigImage = new File([new Uint8Array(6 * 1024 * 1024)], "big.png", {
      type: "image/png",
    });

    const result = restaurantSchema.safeParse({
      name: "Spice Hub",
      address: "123 Food Street",
      mapLink: "",
      phone: "9800000000",
      cuisine: "Nepali",
      image: bigImage,
    });

    expect(result.success).toBe(false);
  });
});
