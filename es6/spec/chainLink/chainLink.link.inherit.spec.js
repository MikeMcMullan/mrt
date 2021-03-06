import ChainLink from "../../lib/chainLink/chainLink.js";

class Person extends ChainLink {
	initialize() {
		this.parameters("dna", "color");
		this.parameters("numb").asProperty;

		this
			.link("arm", Arm)
			.inherit("dna", "color", "numb");
	}
}

class Arm extends ChainLink {
	initialize() {
		this.parameters("dna", "color");
		this.parameters("numb").asProperty;
	}
}

describe("chainLink.link.inherit", () => {
	let person,
			arm,
			dna,
			color;

	beforeEach(() => {
		dna = "AGDEAGA";
		color = "skin";
		person = new Person();

		person
			.dna(dna)
			.color(color)
			.numb;

		arm = person.arm();
	});

	it("copy the inherited parameters to the newly instantiated chain link", () => {
		const values = {
			dna: arm.dna(),
			color: arm.color(),
			isNumb: arm.isNumb
		};

		values.should.eql({
			dna: dna,
			color: color,
			isNumb: true
		});
	});
});
