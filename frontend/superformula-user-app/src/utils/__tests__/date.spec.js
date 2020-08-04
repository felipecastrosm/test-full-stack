import { shortStringFormat } from "@/utils/date";

describe("ShortStringFormat", () => {
    test("parses and formats date string", () => {
        const result = shortStringFormat("2020-08-03");

        expect(result).toBe("3 Aug 2020");
    });

    test("parses and formats date string on first day of the month", () => {
        const result = shortStringFormat("2020-08-01");

        expect(result).toBe("1 Aug 2020");
    });

    test("parses and formats date string on first day of the year", () => {
        const result = shortStringFormat("2020-01-01");

        expect(result).toBe("1 Jan 2020");
    });
})