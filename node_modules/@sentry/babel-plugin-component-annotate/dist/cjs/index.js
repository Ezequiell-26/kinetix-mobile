Object.defineProperties(exports, {
	__esModule: { value: true },
	[Symbol.toStringTag]: { value: "Module" }
});
//#region src/constants.ts
/**
* MIT License
*
* Copyright (c) 2020 Engineering at FullStory
*
* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the "Software"), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included in all
* copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
* SOFTWARE.
*
*/
const KNOWN_INCOMPATIBLE_PLUGINS = ["react-native-testfairy", "@react-navigation"];
const DEFAULT_IGNORED_ELEMENTS = [
	"a",
	"abbr",
	"address",
	"area",
	"article",
	"aside",
	"audio",
	"b",
	"base",
	"bdi",
	"bdo",
	"blockquote",
	"body",
	"br",
	"button",
	"canvas",
	"caption",
	"cite",
	"code",
	"col",
	"colgroup",
	"data",
	"datalist",
	"dd",
	"del",
	"details",
	"dfn",
	"dialog",
	"div",
	"dl",
	"dt",
	"em",
	"embed",
	"fieldset",
	"figure",
	"footer",
	"form",
	"h1",
	"h2",
	"h3",
	"h4",
	"h5",
	"h6",
	"head",
	"header",
	"hgroup",
	"hr",
	"html",
	"i",
	"iframe",
	"img",
	"input",
	"ins",
	"kbd",
	"keygen",
	"label",
	"legend",
	"li",
	"link",
	"main",
	"map",
	"mark",
	"menu",
	"menuitem",
	"meter",
	"nav",
	"noscript",
	"object",
	"ol",
	"optgroup",
	"option",
	"output",
	"p",
	"param",
	"pre",
	"progress",
	"q",
	"rb",
	"rp",
	"rt",
	"rtc",
	"ruby",
	"s",
	"samp",
	"script",
	"section",
	"select",
	"small",
	"source",
	"span",
	"strong",
	"style",
	"sub",
	"summary",
	"sup",
	"table",
	"tbody",
	"td",
	"template",
	"textarea",
	"tfoot",
	"th",
	"thead",
	"time",
	"title",
	"tr",
	"track",
	"u",
	"ul",
	"var",
	"video",
	"wbr"
];
//#endregion
//#region src/experimental.ts
const REACT_NATIVE_ELEMENTS = [
	"Image",
	"Text",
	"View",
	"ScrollView",
	"TextInput",
	"TouchableOpacity",
	"TouchableHighlight",
	"TouchableWithoutFeedback",
	"FlatList",
	"SectionList",
	"ActivityIndicator",
	"Button",
	"Switch",
	"Modal",
	"SafeAreaView",
	"StatusBar",
	"KeyboardAvoidingView",
	"RefreshControl",
	"Picker",
	"Slider"
];
function experimentalComponentNameAnnotatePlugin({ types: t }) {
	return { visitor: {
		Program: { enter(path, state) {
			state.sentryFragmentContext = collectFragmentContext$1(path);
		} },
		FunctionDeclaration(path, state) {
			if (!path.node.id || !path.node.id.name) return;
			functionBodyPushAttributes$1(createJSXProcessingContext$1(state, t, path.node.id.name), path);
		},
		ArrowFunctionExpression(path, state) {
			const parent = path.parent;
			if (!parent || !("id" in parent) || !parent.id || !("name" in parent.id) || !parent.id.name) return;
			functionBodyPushAttributes$1(createJSXProcessingContext$1(state, t, parent.id.name), path);
		},
		ClassDeclaration(path, state) {
			const name = path.get("id");
			const render = path.get("body").get("body").find((prop) => {
				return prop.isClassMethod() && prop.get("key").isIdentifier({ name: "render" });
			});
			if (!render || !render.traverse) return;
			const context = createJSXProcessingContext$1(state, t, name.node?.name || "");
			render.traverse({ ReturnStatement(returnStatement) {
				const arg = returnStatement.get("argument");
				if (!arg.isJSXElement() && !arg.isJSXFragment()) return;
				processJSX$1(context, arg);
			} });
		}
	} };
}
/**
* Checks if an element name represents an HTML element (as opposed to a React component).
* HTML elements include standard lowercase HTML tags and React Native elements.
*/
function isHtmlElement(elementName) {
	if (elementName === UNKNOWN_ELEMENT_NAME$1) return false;
	if (elementName.length > 0 && elementName.charAt(0) === elementName.charAt(0).toLowerCase()) return true;
	if (REACT_NATIVE_ELEMENTS.includes(elementName)) return true;
	return false;
}
/**
* Creates a JSX processing context from the plugin state
*/
function createJSXProcessingContext$1(state, t, componentName) {
	return {
		t,
		componentName,
		attributeName: attributeNamesFromState$1(state),
		ignoredComponents: state.opts.ignoredComponents ?? [],
		fragmentContext: state.sentryFragmentContext
	};
}
/**
* Processes the body of a function to add Sentry tracking attributes to JSX elements.
* Handles various function body structures including direct JSX returns, conditional expressions,
* and nested JSX elements.
*/
function functionBodyPushAttributes$1(context, path) {
	let jsxNode;
	const functionBody = path.get("body").get("body");
	if (!("length" in functionBody) && functionBody.parent && (functionBody.parent.type === "JSXElement" || functionBody.parent.type === "JSXFragment")) {
		const maybeJsxNode = functionBody.find((c) => {
			return c.type === "JSXElement" || c.type === "JSXFragment";
		});
		if (!maybeJsxNode) return;
		jsxNode = maybeJsxNode;
	} else {
		const returnStatement = functionBody.find((c) => {
			return c.type === "ReturnStatement";
		});
		if (!returnStatement) return;
		const arg = returnStatement.get("argument");
		if (!arg) return;
		if (Array.isArray(arg)) return;
		if (arg.isConditionalExpression()) {
			const consequent = arg.get("consequent");
			if (consequent.isJSXFragment() || consequent.isJSXElement()) processJSX$1(context, consequent);
			const alternate = arg.get("alternate");
			if (alternate.isJSXFragment() || alternate.isJSXElement()) processJSX$1(context, alternate);
			return;
		}
		if (!arg.isJSXFragment() && !arg.isJSXElement()) return;
		jsxNode = arg;
	}
	if (!jsxNode) return;
	processJSX$1(context, jsxNode);
}
/**
* Recursively processes JSX elements to add Sentry tracking attributes.
* Handles both JSX elements and fragments, applying appropriate attributes
* based on configuration and component context.
*/
function processJSX$1(context, jsxNode) {
	if (!jsxNode) return;
	const paths = jsxNode.get("openingElement");
	if ((Array.isArray(paths) ? paths : [paths]).reduce((prev, openingElement) => prev || applyAttributes$1(context, openingElement, context.componentName), false)) return;
	let children = jsxNode.get("children");
	if (children && !("length" in children)) children = [children];
	children.forEach((child) => {
		if (!child.node) return;
		const openingElement = child.get("openingElement");
		if (Array.isArray(openingElement)) return;
		processJSX$1(context, child);
	});
}
/**
* Applies Sentry tracking attributes to a JSX opening element.
* Adds component name, element name, and source file attributes while
* respecting ignore lists and fragment detection.
*/
function applyAttributes$1(context, openingElement, componentName) {
	const { t, attributeName: componentAttributeName, ignoredComponents, fragmentContext } = context;
	if (!openingElement.node) return false;
	if (isReactFragment$1(t, openingElement, fragmentContext)) return false;
	if (!openingElement.node.attributes) openingElement.node.attributes = [];
	const elementName = getPathName$1(t, openingElement);
	if (!isHtmlElement(elementName)) return false;
	if (!ignoredComponents.some((ignoredComponent) => ignoredComponent === componentName || ignoredComponent === elementName) && !hasAttributeWithName$1(openingElement, componentAttributeName)) {
		if (componentAttributeName) openingElement.node.attributes.push(t.jSXAttribute(t.jSXIdentifier(componentAttributeName), t.stringLiteral(componentName)));
	}
	return true;
}
function attributeNamesFromState$1(state) {
	if (state.opts.native) return "dataSentryComponent";
	return "data-sentry-component";
}
function collectFragmentContext$1(programPath) {
	const fragmentAliases = /* @__PURE__ */ new Set();
	const reactNamespaceAliases = new Set(["React"]);
	programPath.traverse({
		ImportDeclaration(importPath) {
			const source = importPath.node.source.value;
			if (source === "react" || source === "React") importPath.node.specifiers.forEach((spec) => {
				if (spec.type === "ImportSpecifier" && spec.imported.type === "Identifier") {
					if (spec.imported.name === "Fragment") fragmentAliases.add(spec.local.name);
				} else if (spec.type === "ImportDefaultSpecifier" || spec.type === "ImportNamespaceSpecifier") reactNamespaceAliases.add(spec.local.name);
			});
		},
		VariableDeclarator(varPath) {
			if (varPath.node.init) {
				const init = varPath.node.init;
				if (varPath.node.id.type === "Identifier") {
					if (init.type === "Identifier" && fragmentAliases.has(init.name)) fragmentAliases.add(varPath.node.id.name);
					if (init.type === "MemberExpression" && init.object.type === "Identifier" && init.property.type === "Identifier" && init.property.name === "Fragment" && reactNamespaceAliases.has(init.object.name)) fragmentAliases.add(varPath.node.id.name);
				}
				if (varPath.node.id.type === "ObjectPattern") {
					if (init.type === "Identifier" && reactNamespaceAliases.has(init.name)) {
						const properties = varPath.node.id.properties;
						for (const prop of properties) if (prop.type === "ObjectProperty" && prop.key && prop.key.type === "Identifier" && prop.value && prop.value.type === "Identifier" && prop.key.name === "Fragment") fragmentAliases.add(prop.value.name);
					}
				}
			}
		}
	});
	return {
		fragmentAliases,
		reactNamespaceAliases
	};
}
function isReactFragment$1(t, openingElement, context) {
	if (openingElement.isJSXFragment()) return true;
	const elementName = getPathName$1(t, openingElement);
	if (elementName === "Fragment" || elementName === "React.Fragment") return true;
	if (context && elementName && context.fragmentAliases.has(elementName)) return true;
	if (openingElement.node && "name" in openingElement.node && openingElement.node.name && typeof openingElement.node.name === "object" && "type" in openingElement.node.name && openingElement.node.name.type === "JSXMemberExpression") {
		const nodeName = openingElement.node.name;
		if (typeof nodeName !== "object" || !nodeName) return false;
		if ("object" in nodeName && "property" in nodeName) {
			const nodeNameObject = nodeName.object;
			const nodeNameProperty = nodeName.property;
			if (typeof nodeNameObject !== "object" || typeof nodeNameProperty !== "object") return false;
			if (!nodeNameObject || !nodeNameProperty) return false;
			const objectName = "name" in nodeNameObject && nodeNameObject.name;
			const propertyName = "name" in nodeNameProperty && nodeNameProperty.name;
			if (objectName === "React" && propertyName === "Fragment") return true;
			if (context) {
				if (context.reactNamespaceAliases.has(objectName) && propertyName === "Fragment") return true;
				if (context.fragmentAliases.has(objectName) && propertyName === "Fragment") return true;
			}
		}
	}
	return false;
}
function hasAttributeWithName$1(openingElement, name) {
	if (!name) return false;
	return openingElement.node.attributes.some((node) => {
		if (node.type === "JSXAttribute") return node.name.name === name;
		return false;
	});
}
function getPathName$1(t, path) {
	if (!path.node) return UNKNOWN_ELEMENT_NAME$1;
	if (!("name" in path.node)) return UNKNOWN_ELEMENT_NAME$1;
	const name = path.node.name;
	if (typeof name === "string") return name;
	if (t.isIdentifier(name) || t.isJSXIdentifier(name)) return name.name;
	if (t.isJSXNamespacedName(name)) return name.name.name;
	if (t.isJSXMemberExpression(name)) return `${getJSXMemberExpressionObjectName$1(t, name.object)}.${name.property.name}`;
	return UNKNOWN_ELEMENT_NAME$1;
}
function getJSXMemberExpressionObjectName$1(t, object) {
	if (t.isJSXIdentifier(object)) return object.name;
	if (t.isJSXMemberExpression(object)) return `${getJSXMemberExpressionObjectName$1(t, object.object)}.${object.property.name}`;
	return UNKNOWN_ELEMENT_NAME$1;
}
const UNKNOWN_ELEMENT_NAME$1 = "unknown";
//#endregion
//#region src/index.ts
const webComponentName = "data-sentry-component";
const webElementName = "data-sentry-element";
const webSourceFileName = "data-sentry-source-file";
const nativeComponentName = "dataSentryComponent";
const nativeElementName = "dataSentryElement";
const nativeSourceFileName = "dataSentrySourceFile";
const SENTRY_LABEL_ATTRIBUTE = "sentry-label";
const MAX_LABEL_LENGTH = 64;
const DEFAULT_TEXT_COMPONENT_NAMES = ["Text", "text"];
const MAX_TEXT_SEARCH_DEPTH = 3;
function componentNameAnnotatePlugin({ types: t }) {
	return { visitor: {
		Program: { enter(path, state) {
			state.sentryFragmentContext = collectFragmentContext(path);
		} },
		FunctionDeclaration(path, state) {
			if (!path.node.id || !path.node.id.name) return;
			if (isKnownIncompatiblePluginFromState(state)) return;
			functionBodyPushAttributes(createJSXProcessingContext(state, t, path.node.id.name), path);
		},
		ArrowFunctionExpression(path, state) {
			const parent = path.parent;
			if (!parent || !("id" in parent) || !parent.id || !("name" in parent.id) || !parent.id.name) return;
			if (isKnownIncompatiblePluginFromState(state)) return;
			functionBodyPushAttributes(createJSXProcessingContext(state, t, parent.id.name), path);
		},
		ClassDeclaration(path, state) {
			const name = path.get("id");
			const render = path.get("body").get("body").find((prop) => {
				return prop.isClassMethod() && prop.get("key").isIdentifier({ name: "render" });
			});
			if (!render || !render.traverse || isKnownIncompatiblePluginFromState(state)) return;
			const context = createJSXProcessingContext(state, t, name.node?.name || "");
			render.traverse({ ReturnStatement(returnStatement) {
				const arg = returnStatement.get("argument");
				if (!arg.isJSXElement() && !arg.isJSXFragment()) return;
				processJSX(context, arg);
			} });
		}
	} };
}
/**
* Creates a JSX processing context from the plugin state
*/
function createJSXProcessingContext(state, t, componentName) {
	return {
		annotateFragments: state.opts["annotate-fragments"] === true,
		t,
		componentName,
		sourceFileName: sourceFileNameFromState(state),
		attributeNames: attributeNamesFromState(state),
		ignoredComponents: state.opts.ignoredComponents ?? [],
		fragmentContext: state.sentryFragmentContext,
		autoInjectSentryLabel: !!state.opts.autoInjectSentryLabel,
		textComponentNames: (state.opts.autoInjectSentryLabel && typeof state.opts.autoInjectSentryLabel === "object" ? state.opts.autoInjectSentryLabel.textComponentNames : void 0) ?? DEFAULT_TEXT_COMPONENT_NAMES
	};
}
/**
* Processes the body of a function to add Sentry tracking attributes to JSX elements.
* Handles various function body structures including direct JSX returns, conditional expressions,
* and nested JSX elements.
*/
function functionBodyPushAttributes(context, path) {
	let jsxNode;
	const functionBody = path.get("body").get("body");
	if (!("length" in functionBody) && functionBody.parent && (functionBody.parent.type === "JSXElement" || functionBody.parent.type === "JSXFragment")) {
		const maybeJsxNode = functionBody.find((c) => {
			return c.type === "JSXElement" || c.type === "JSXFragment";
		});
		if (!maybeJsxNode) return;
		jsxNode = maybeJsxNode;
	} else {
		const returnStatement = functionBody.find((c) => {
			return c.type === "ReturnStatement";
		});
		if (!returnStatement) return;
		const arg = returnStatement.get("argument");
		if (!arg) return;
		if (Array.isArray(arg)) return;
		if (arg.isConditionalExpression()) {
			const consequent = arg.get("consequent");
			if (consequent.isJSXFragment() || consequent.isJSXElement()) processJSX(context, consequent);
			const alternate = arg.get("alternate");
			if (alternate.isJSXFragment() || alternate.isJSXElement()) processJSX(context, alternate);
			return;
		}
		if (!arg.isJSXFragment() && !arg.isJSXElement()) return;
		jsxNode = arg;
	}
	if (!jsxNode) return;
	processJSX(context, jsxNode);
}
/**
* Recursively processes JSX elements to add Sentry tracking attributes.
* Handles both JSX elements and fragments, applying appropriate attributes
* based on configuration and component context.
*/
function processJSX(context, jsxNode, componentName) {
	if (!jsxNode) return;
	const currentComponentName = componentName ?? context.componentName;
	const isRootElement = componentName === void 0;
	const paths = jsxNode.get("openingElement");
	(Array.isArray(paths) ? paths : [paths]).forEach((openingElement) => {
		applyAttributes(context, openingElement, currentComponentName);
	});
	let children = jsxNode.get("children");
	if (children && !("length" in children)) children = [children];
	let shouldSetComponentName = context.annotateFragments;
	children.forEach((child) => {
		if (!child.node) return;
		const openingElement = child.get("openingElement");
		if (Array.isArray(openingElement)) return;
		if (shouldSetComponentName && openingElement && openingElement.node) {
			shouldSetComponentName = false;
			processJSX(context, child, currentComponentName);
		} else processJSX(context, child, "");
	});
	if (isRootElement && context.autoInjectSentryLabel) maybeInjectSentryLabel(context, jsxNode);
}
/**
* Applies Sentry tracking attributes to a JSX opening element.
* Adds component name, element name, and source file attributes while
* respecting ignore lists and fragment detection.
*/
function applyAttributes(context, openingElement, componentName) {
	const { t, attributeNames, ignoredComponents, fragmentContext, sourceFileName } = context;
	const [componentAttributeName, elementAttributeName, sourceFileAttributeName] = attributeNames;
	if (!openingElement.node) return;
	if (isReactFragment(t, openingElement, fragmentContext)) return;
	if (!openingElement.node.attributes) openingElement.node.attributes = [];
	const elementName = getPathName(t, openingElement);
	const isAnIgnoredComponent = ignoredComponents.some((ignoredComponent) => ignoredComponent === componentName || ignoredComponent === elementName);
	let isAnIgnoredElement = false;
	if (!isAnIgnoredComponent && !hasAttributeWithName(openingElement, elementAttributeName)) {
		if (DEFAULT_IGNORED_ELEMENTS.includes(elementName)) isAnIgnoredElement = true;
		else if (elementAttributeName) openingElement.node.attributes.push(t.jSXAttribute(t.jSXIdentifier(elementAttributeName), t.stringLiteral(elementName)));
	}
	if (componentName && !isAnIgnoredComponent && !hasAttributeWithName(openingElement, componentAttributeName)) {
		if (componentAttributeName) openingElement.node.attributes.push(t.jSXAttribute(t.jSXIdentifier(componentAttributeName), t.stringLiteral(componentName)));
	}
	if (sourceFileName && !isAnIgnoredComponent && (componentName || !isAnIgnoredElement) && !hasAttributeWithName(openingElement, sourceFileAttributeName)) {
		if (sourceFileAttributeName) openingElement.node.attributes.push(t.jSXAttribute(t.jSXIdentifier(sourceFileAttributeName), t.stringLiteral(sourceFileName)));
	}
}
function sourceFileNameFromState(state) {
	const name = fullSourceFileNameFromState(state);
	if (!name) return;
	if (name.indexOf("/") !== -1) return name.split("/").pop();
	else if (name.indexOf("\\") !== -1) return name.split("\\").pop();
	else return name;
}
function fullSourceFileNameFromState(state) {
	const name = state.file.opts.parserOpts?.sourceFileName;
	if (typeof name === "string") return name;
	return null;
}
function isKnownIncompatiblePluginFromState(state) {
	const fullSourceFileName = fullSourceFileNameFromState(state);
	if (!fullSourceFileName) return false;
	return KNOWN_INCOMPATIBLE_PLUGINS.some((pluginName) => {
		if (fullSourceFileName.includes(`/node_modules/${pluginName}/`) || fullSourceFileName.includes(`\\node_modules\\${pluginName}\\`)) return true;
		return false;
	});
}
function attributeNamesFromState(state) {
	if (state.opts.native) return [
		nativeComponentName,
		nativeElementName,
		nativeSourceFileName
	];
	return [
		webComponentName,
		webElementName,
		webSourceFileName
	];
}
function collectFragmentContext(programPath) {
	const fragmentAliases = /* @__PURE__ */ new Set();
	const reactNamespaceAliases = new Set(["React"]);
	programPath.traverse({
		ImportDeclaration(importPath) {
			const source = importPath.node.source.value;
			if (source === "react" || source === "React") importPath.node.specifiers.forEach((spec) => {
				if (spec.type === "ImportSpecifier" && spec.imported.type === "Identifier") {
					if (spec.imported.name === "Fragment") fragmentAliases.add(spec.local.name);
				} else if (spec.type === "ImportDefaultSpecifier" || spec.type === "ImportNamespaceSpecifier") reactNamespaceAliases.add(spec.local.name);
			});
		},
		VariableDeclarator(varPath) {
			if (varPath.node.init) {
				const init = varPath.node.init;
				if (varPath.node.id.type === "Identifier") {
					if (init.type === "Identifier" && fragmentAliases.has(init.name)) fragmentAliases.add(varPath.node.id.name);
					if (init.type === "MemberExpression" && init.object.type === "Identifier" && init.property.type === "Identifier" && init.property.name === "Fragment" && reactNamespaceAliases.has(init.object.name)) fragmentAliases.add(varPath.node.id.name);
				}
				if (varPath.node.id.type === "ObjectPattern") {
					if (init.type === "Identifier" && reactNamespaceAliases.has(init.name)) {
						const properties = varPath.node.id.properties;
						for (const prop of properties) if (prop.type === "ObjectProperty" && prop.key && prop.key.type === "Identifier" && prop.value && prop.value.type === "Identifier" && prop.key.name === "Fragment") fragmentAliases.add(prop.value.name);
					}
				}
			}
		}
	});
	return {
		fragmentAliases,
		reactNamespaceAliases
	};
}
function isReactFragment(t, openingElement, context) {
	if (openingElement.isJSXFragment()) return true;
	const elementName = getPathName(t, openingElement);
	if (elementName === "Fragment" || elementName === "React.Fragment") return true;
	if (context && elementName && context.fragmentAliases.has(elementName)) return true;
	if (openingElement.node && "name" in openingElement.node && openingElement.node.name && typeof openingElement.node.name === "object" && "type" in openingElement.node.name && openingElement.node.name.type === "JSXMemberExpression") {
		const nodeName = openingElement.node.name;
		if (typeof nodeName !== "object" || !nodeName) return false;
		if ("object" in nodeName && "property" in nodeName) {
			const nodeNameObject = nodeName.object;
			const nodeNameProperty = nodeName.property;
			if (typeof nodeNameObject !== "object" || typeof nodeNameProperty !== "object") return false;
			if (!nodeNameObject || !nodeNameProperty) return false;
			const objectName = "name" in nodeNameObject && nodeNameObject.name;
			const propertyName = "name" in nodeNameProperty && nodeNameProperty.name;
			if (objectName === "React" && propertyName === "Fragment") return true;
			if (context) {
				if (context.reactNamespaceAliases.has(objectName) && propertyName === "Fragment") return true;
				if (context.fragmentAliases.has(objectName) && propertyName === "Fragment") return true;
			}
		}
	}
	return false;
}
function hasAttributeWithName(openingElement, name) {
	if (!name) return false;
	return openingElement.node.attributes.some((node) => {
		if (node.type === "JSXAttribute") return node.name.name === name;
		return false;
	});
}
function getPathName(t, path) {
	if (!path.node) return UNKNOWN_ELEMENT_NAME;
	if (!("name" in path.node)) return UNKNOWN_ELEMENT_NAME;
	const name = path.node.name;
	if (typeof name === "string") return name;
	if (t.isIdentifier(name) || t.isJSXIdentifier(name)) return name.name;
	if (t.isJSXNamespacedName(name)) return name.name.name;
	if (t.isJSXMemberExpression(name)) return `${getJSXMemberExpressionObjectName(t, name.object)}.${name.property.name}`;
	return UNKNOWN_ELEMENT_NAME;
}
function getJSXMemberExpressionObjectName(t, object) {
	if (t.isJSXIdentifier(object)) return object.name;
	if (t.isJSXMemberExpression(object)) return `${getJSXMemberExpressionObjectName(t, object.object)}.${object.property.name}`;
	return UNKNOWN_ELEMENT_NAME;
}
/**
* Extracts static text content from JSX children, searching up to a depth limit.
* Collects text from JSXText nodes of the root element and from recognized
* text components (e.g. <Text>). Non-text custom components are traversed
* but their own JSXText is not collected.
*
* Returns null when dynamic content is found anywhere in the subtree,
* signaling that the entire label should be skipped.
*/
function extractStaticTextFromChildren(t, node, textComponentNames, depth, isRoot) {
	if (depth <= 0) return [];
	const texts = [];
	for (const child of node.children) if (t.isJSXText(child)) {
		if (isRoot) {
			const trimmed = child.value.replace(/\s+/g, " ").trim();
			if (trimmed) texts.push(trimmed);
		}
	} else if (t.isJSXElement(child)) {
		const childName = getElementName(t, child.openingElement);
		if (textComponentNames.includes(childName)) {
			const innerTexts = extractTextFromTextComponent(t, child, textComponentNames);
			if (innerTexts === null) return null;
			texts.push(...innerTexts);
		} else {
			const result = extractStaticTextFromChildren(t, child, textComponentNames, depth - 1, false);
			if (result === null) return null;
			texts.push(...result);
		}
	} else if (t.isJSXFragment(child)) {
		const result = extractStaticTextFromChildren(t, child, textComponentNames, depth, isRoot);
		if (result === null) return null;
		texts.push(...result);
	} else if (t.isJSXExpressionContainer(child)) {
		if (!t.isJSXEmptyExpression(child.expression)) return null;
	} else if (t.isJSXSpreadChild(child)) return null;
	return texts;
}
/**
* Recursively extracts static text from within a recognized text component.
* Handles nested text components (e.g. <Text>Hello <Text style={bold}>world</Text></Text>)
* which is the standard React Native pattern for inline styling.
*
* Returns null when any dynamic content is found, signaling bail-out.
*/
function extractTextFromTextComponent(t, node, textComponentNames) {
	const texts = [];
	for (const child of node.children) if (t.isJSXText(child)) {
		const trimmed = child.value.replace(/\s+/g, " ").trim();
		if (trimmed) texts.push(trimmed);
	} else if (t.isJSXExpressionContainer(child)) {
		if (!t.isJSXEmptyExpression(child.expression)) return null;
	} else if (t.isJSXElement(child)) {
		const childName = getElementName(t, child.openingElement);
		if (textComponentNames.includes(childName)) {
			const innerTexts = extractTextFromTextComponent(t, child, textComponentNames);
			if (innerTexts === null) return null;
			texts.push(...innerTexts);
		} else if (extractTextFromTextComponent(t, child, textComponentNames) === null) return null;
	} else if (t.isJSXFragment(child)) {
		const innerTexts = extractTextFromTextComponent(t, child, textComponentNames);
		if (innerTexts === null) return null;
		texts.push(...innerTexts);
	} else if (t.isJSXSpreadChild(child)) return null;
	return texts;
}
function getElementName(t, openingElement) {
	const name = openingElement.name;
	if (t.isJSXIdentifier(name)) return name.name;
	if (t.isJSXMemberExpression(name)) return `${getJSXMemberExpressionObjectName(t, name.object)}.${name.property.name}`;
	return "";
}
/**
* Injects a sentry-label attribute on the root JSX element of a component if
* static text content can be extracted from its children.
*
* When the root is a JSX fragment, the first JSXElement child is used as the
* target for both text extraction and attribute injection (since fragments
* cannot carry attributes).
*/
function maybeInjectSentryLabel(context, jsxNode) {
	const { t, textComponentNames, ignoredComponents, componentName } = context;
	const node = jsxNode.node;
	let targetElement;
	if (t.isJSXElement(node)) targetElement = node;
	else if (t.isJSXFragment(node)) {
		const firstChild = node.children.find((c) => t.isJSXElement(c));
		if (!firstChild) return;
		targetElement = firstChild;
	} else return;
	const targetElementName = getElementName(t, targetElement.openingElement);
	if (ignoredComponents.some((ignored) => ignored === componentName || ignored === targetElementName)) return;
	if (targetElement.openingElement.attributes.some((attr) => t.isJSXAttribute(attr) && attr.name.name === SENTRY_LABEL_ATTRIBUTE)) return;
	const texts = extractStaticTextFromChildren(t, targetElement, textComponentNames, MAX_TEXT_SEARCH_DEPTH, true);
	if (texts === null) return;
	let label = texts.join(" ").replace(/\s+/g, " ").trim();
	if (!label) return;
	if (label.length > MAX_LABEL_LENGTH) label = label.substring(0, MAX_LABEL_LENGTH - 3) + "...";
	targetElement.openingElement.attributes.push(t.jSXAttribute(t.jSXIdentifier(SENTRY_LABEL_ATTRIBUTE), t.stringLiteral(label)));
}
const UNKNOWN_ELEMENT_NAME = "unknown";
//#endregion
exports.default = componentNameAnnotatePlugin;
exports.experimentalComponentNameAnnotatePlugin = experimentalComponentNameAnnotatePlugin;

//# sourceMappingURL=index.js.map