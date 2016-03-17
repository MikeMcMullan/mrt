import privateData from "incognito";
import inflect from "jargon";

export default class ChainLink {
	constructor(...options) {
		this.links = [];
		this.initialize(...options);
	}

	initialize () {}

	parameters(...parameterNames) {
		if (parameterNames.length > 0) {
			return new ParameterCollection(this, parameterNames);
		} else {
			return this;
		}
	}

	link(methodName, LinkConstructor) {
		const newLink = new Link(this, methodName, LinkConstructor);
		this.links.push(newLink);
		return newLink;
	}
}

const addLink = Symbol();

export class Link {
	constructor(parentLink, methodName, LinkConstructor) {
		const _ = privateData(this);

		_.into = false;

		this.parentLink = parentLink;
		this.methodName = methodName;
		this.LinkConstructor = LinkConstructor;

		this.method = (...options) => {
			return this[addLink](...options);
		};

		this.parentLink[this.methodName] = this.method;
	}

	usingKey(keyName) {
		privateData(this).keyName = keyName;
		return this;
	}

	[addLink](...options) {
		const _ = privateData(this);
		const instance = new this.LinkConstructor(...options);

		this.parentLink.links.forEach(link => {
			const methodPropertyDescriptor = Object.getOwnPropertyDescriptor(this.parentLink, link.methodName);
			if (methodPropertyDescriptor.get && !methodPropertyDescriptor.set) {
				Object.defineProperty(instance, link.methodName, {
					get: link.method
				});
			} else {
				instance[link.methodName] = link.method;
			}
		});

		if (_.into) {
			this.parentLink[_.into].push(instance);
		}
		return instance;
	}

	into(collectionName) {
		const _ = privateData(this);
		_.into = collectionName;
		this.parentLink[_.into] = [];
		return this;
	}

	get asProperty() {
		Object.defineProperty(this.parentLink, this.methodName, {
			get: () => {
				this[addLink]();
				return this.parentLink;
			}
		});
		return this;
	}
}

export class ParameterCollection {
	constructor(parentLink, parameterNames) {
		const _ = privateData(this);
		_.parentLink = parentLink;
		_.parameterNames = parameterNames;

		_.aggregate = false;
		_.multiValue = false;

		_.parameterNames.forEach(parameterName => {
			_.parentLink[parameterName] = (...newValue) => {
				if (newValue.length > 0) {
					if (!_.multiValue) {
						newValue = newValue[0];
					}

					if (_.aggregate || _.multiValue) {
						if (!_[parameterName]) { _[parameterName] = []; }
					}

					if (_.aggregate || _.multiValue) {
						if (_.aggregate) {
							_[parameterName].push(newValue);
						} else {
							_[parameterName] = newValue;
						}
					} else {
						_[parameterName] = newValue;
					}
					return parentLink;
				} else {
					return _[parameterName];
				}
			};
		});
	}

	get aggregate() {
		privateData(this).aggregate = true;
		return this;
	}

	get multiValue() {
		privateData(this).multiValue = true;
		return this;
	}

	get asProperty() {
		const _ = privateData(this);

		_.parameterNames.forEach(parameterName => {
			const capitalizedMethodName = inflect(parameterName).pascal.toString();
			const getMethodName = `is${capitalizedMethodName}`;

			_.parentLink[getMethodName] = false;

			Object.defineProperty(_.parentLink, parameterName, {
				get: () => {
					_.parentLink[getMethodName] = true;
				}
			});
		});

		return this;
	}
}
















































// class Parameter extends ChainLink {
// 	initialize(parameterName) {
// 		this.parameters("name");
// 		this.name(parameterName);
// 	}
// }
//
// export default class ChainLink {
// 	constructor() {
// 		this.initialize();
// 	}
//
// 	initialize() {}
//
// 	parameters(...parameterNames) {
// 		if (parameterNames.length > 0) {
// 			return new ChainLinkCollection(this, parameterNames, Parameter);
// 		} else {
// 			return this; // enables chaining
// 		}
// 	}
// }
//
// class ChainLinkCollection {
// 	constructor(parentLink, parameters, LinkConstructor) {
// 		this.parentLink = parentLink;
// 		this.parameters = parameters;
// 		this.LinkConstructor = LinkConstructor;
// 		this.links = [];
// 		this.createLinks();
// 	}
//
// 	createLinks() {
// 		this.parameters.forEach(parameter => {
// 			this.links.push(new this.LinkConstructor(parameter));
// 		});
// 	}
// }
//
// // class CrossLink {
// // 	constructor(parentLink, methodName, LinkConstructor) {
// // 		this.parentLink = parentLink;
// // 		this.methodName = methodName;
// // 		this.LinkConstructor = LinkConstructor;
// // 		this.collectionName;
// // 		this.parentLink[this.methodName] = this.linkSingle;
// // 	}
// //
// // 	linkSingle(...options) {
// // 		return new this.LinkConstructor(...options);
// // 	}
// //
// // 	linkCollection(...parameters) {
// // 		return new ChainLinkCollection(parameters, this.LinkConstructor);
// // 	}
// //
// // 	intoCollection(collectionName) {
// // 		this.collectionName = collectionName;
// // 		this.parentLink[this.methodName] = this.linkCollection;
// // 	}
// // }
