import Observer from "./../src/core/Observer";

describe("define", () => {

    it("flat", () => {
       const ob = new Observer("flat", 10);
       expect(ob.name).toBe("flat");
       expect(ob._readonly).toBe(false);

       const obBool = new Observer("bool", true);
       expect(obBool.name).toBe("bool");
       expect(obBool._readonly).toBe(false);
       expect(obBool.value).toBe(true);

    });

    it("deep", () => {
        const arrOb = new Observer("arr", [0, 10, 11]);
        expect(arrOb.children.length).toBe(3);
        expect(arrOb.childrenMap[1].value).toBe(10);
        expect(arrOb.childrenMap[1] instanceof Observer).toBe(true);

        const objectOb = new Observer("arr", {name: "TestName"});
        expect(objectOb.children.length).toBe(1);
        expect(objectOb.childrenMap["name"] instanceof Observer).toBe(true);
        expect(objectOb.getChild("name") instanceof Observer).toBe(true);
        expect(objectOb.getChild("name").value).toBe("TestName");
    });

});