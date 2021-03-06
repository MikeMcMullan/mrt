import ChainLink from "../../lib/chainLink/chainLink.js";

class Person extends ChainLink {
	initialize() {
		this.link("thought", Thought).asProperty;
	}
}

class Thought extends ChainLink {}

describe("chainLink.link.asProperty", () => {
	let person,
			returnValue;

	beforeEach(() => {
		person = new Person();
		returnValue = person.thought;
	});

	it("should return a new instance of the ChainLink constructor when called", () => {
		returnValue.should.be.instanceOf(Thought);
	});

	it("should add the newly instantiated chain link to the links objects", () => {
		person.links.thought.should.eql([returnValue]);
	});
});
