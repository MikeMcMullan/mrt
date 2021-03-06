import Chain from "../../lib/mrt.js";
import sinon from "sinon";

let initializeSpy;

class Component extends Chain {
	initialize(newName, newAge) {
		initializeSpy(newName, newAge);
	}
}

describe(".multipleValueParameters(...parameterNames)", () => {
	let component,
			name,
			age;

	beforeEach(() => {
		initializeSpy = sinon.spy();
		name = "Bob Belcher";
		age = 44;
		component = new Component(name, age);
	});

	it("should create a getter and setter function for each new parameter with multiple arguments", () => {
		const valueOne = "SomeValue";
		const valueTwo = "AnotherValue";

		component.multipleValueParameters("handler");
		component.handler(valueOne, valueTwo);
		component.handler().should.eql([
			valueOne,
			valueTwo
		]);
	});
});
