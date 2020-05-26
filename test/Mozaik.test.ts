import Mozaik from "./../src/index";
import Observer from "./../src/core/Observer";

const data = new Mozaik({
    user: {
        name: "Admin",
        skills: [
            {
                name: "js"
            }
        ]
    },
    app: {
        isTouch: true
    },
    company: {
        name: "Apple"
    },
    os: "iOS"
});

describe("get", () => {

    it("get method", () => {
        const val = data.get("user.name");
        expect(val).toBe("Admin");
    });

    it("undefined", () => {
        const val = data.get("user.surName");
        expect(val).toBeUndefined();
    });

    it("default value", () => {
        const val = data.get("user.surName", "SurAdmin");
        expect(val).toBe("SurAdmin");
    });

    it("get link", () => {
        const link = data.get("user.name", undefined, {
            getLink: true
        });

        expect(link instanceof Observer).toBe(true);
        expect(link.name).toBe("name");
        expect(!!link.emitter).toBe(true);
    });

});

describe("set", () => {

    it("set", () => {
        data.set("app.isTouch", 100);
        const newVal = data.get("app.isTouch");
        expect(newVal).toBe(100);
    });

    it("Not notify", () => {
        let notifyCount = 0;
        const state = new Mozaik({
            name: "admin"
        });
        state.on('name', () => {
            notifyCount++;
        });
        state.set('name', 'admin2', {notify: false});
        expect(notifyCount).toBe(0)
    });

    it("re-create", () => {
        data.set("company.phone", 123456);
        const isMobile = data.get("company.phone");
        const appOb = data.get("company", undefined, {getLink: true});
        expect(isMobile).toBe(123456);
        expect(appOb.children.length).toBe(2);
    });

    it("re-create deep", () => {
        const data = new Mozaik({
            user: {
                company: {}
            }
        });

        data.set("user.company.name", "Apple");
        const name = data.get("user.company.name");
        expect(name).toBe("Apple");
    });

    it("set for primitive", () => {
        const store1 = new Mozaik({
            name: "Admin"
        });
        store1.set("name", "Admin2");
        const os = store1.get("name", undefined, {getLink: true});
        expect(os.value).toBe("Admin2");
    });

    it("set for undefined root observer",  () => {
        const data = new Mozaik({});

        data.set("model", "iPhone");
        const modelOb = data.get("model", undefined, {getLink: true});
        expect(modelOb instanceof Observer).toBe(true);
        expect(modelOb.value).toBe("iPhone");

        data.set("company.name", "Apple");
        const deepOb = data.get("company", undefined, {getLink: true});
        expect(deepOb instanceof Observer).toBe(true);
        expect(deepOb.value).toStrictEqual({name: "Apple"});
        expect(deepOb.children.length).toBe(1);

    });

    it("make child of reactive", () => {
        const store = new Mozaik({
            user: "artur"
        });

        store.set("user", {
            firstName: "admin",
            last: "root"
        });
        const last = store.get('user.last');
        expect(last).toBe("root");
    });

});

describe("subscribes", () => {

    it("change", () => {
        data.on("user.skills[0].name", "change", (res) => {
            expect(!!res).toBe(true);
            expect(res.val).toBe("php");
            expect(res.oldVal).toBe("js");
        });

        data.set("user.skills[0].name", "php");
    });

    it("subscribe on undefined", () => {
        let changed = false;
        data.on("os.version", "change", () => {
            changed = true;
        });
        data.set("os.version", 13);

        expect(changed).toBe(false);
    });

    it("when set not primitive for parent", () => {
        let changCount = 0;
        data.on("user", "change", () => {
            changCount++;
        });
        data.on("user.name", "change", () => {
            changCount++;
        });
        data.on("user.skills[0].name", "change", () => {
            changCount++;
        });
        data.on("user.skills[0]", "change", () => {
            changCount++;
        });
        data.set("user", {
            name: "TestName",
            skills: []
        });

        expect(changCount).toBe(1);
    });

    it("default event change", () => {
        data.on("user.name", (res) => {
            expect(!!res).toBe(true);
            expect(res.val).toBe("TestNameDefault");
        });

        data.set("user.name", "TestNameDefault");
    });

});

describe("middleware", () => {

    it("use", () => {
        const store = new Mozaik({
            point: '1234'
        });
        const res = store.get('point', null, {
            middleware: [
                (val) => {
                    return Number(val);
                }
            ]
        });
        expect(res).toBe(1234);
    });

    it("use cascade", () => {
        const store = new Mozaik({
            point: '1234.23323'
        });
        const res = store.get('point', null, {
            middleware: [
                (val) => {
                    return Number(val);
                },
                (val) => {
                    return val.toFixed(2)
                },
                (val) => {
                    return Number(val);
                }
            ]
        });
        expect(res).toBe(1234.23);
    });

    it("use global", () => {
        Mozaik.registerMiddleware('toNumber', (val) => {
            return Number(val);
        });
        const store = new Mozaik({
            point: '1234.23323'
        });
        const res = store.get('point', null, {
            middleware: [
                'toNumber',
                (val) => {
                    return val.toFixed(2)
                },
                'toNumber'
            ]
        });
        expect(res).toBe(1234.23);
    });

});

describe("readonly", () => {

    it("lock", () => {
        data.lock("app.isTouch");
        const isTouchOb = data.get("app.isTouch", undefined, {
            getLink: true
        });
        const desc = Object.getOwnPropertyDescriptor(isTouchOb, "target");
        expect(desc.writable).toBe(false);

    });

    it("look deep", () => {
        data.lock("app", {deep: true});
        const appOb = data.get("app", undefined, {
            getLink: true
        });
        const isTouchOb = data.get("app.isTouch", undefined, {
            getLink: true
        });
        const rootDesc = Object.getOwnPropertyDescriptor(appOb, "target");
        const childDesc = Object.getOwnPropertyDescriptor(isTouchOb, "target");
        expect(rootDesc.writable).toBe(false);
        expect(childDesc.writable).toBe(false);
    });

    it("unlock", () => {
        data.lock("app.isTouch");
        const isTouchOb = data.get("app.isTouch", undefined, {
            getLink: true
        });
        isTouchOb.unlock();
        const desc = Object.getOwnPropertyDescriptor(isTouchOb, "target");
        expect(desc.writable).toBe(true);
    });

});
