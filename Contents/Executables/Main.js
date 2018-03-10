/*
 React Studio wrapper for the 'react-rating' npm package.

 - 2017.02.27 / Pauli Ojala / pauli@neonto.com
 */


// -- plugin info requested by host app --

this.describePlugin = function(id, lang) {
  switch (id) {
    case 'displayName':
      return "Firebase Auth";

    case 'shortDisplayText':
      return "Firebase Authentication.";

    case 'defaultNameForNewInstance':
      return "firebaseauth";
  }
}


// -- private variables --

this._data = {
  apiKey: "",
  projectId: "",
  messageSenderId: ""
};


// -- persistence, i.e. saving and loading --

this.persist = function() {
  return this._data;
}

this.unpersist = function(data) {
	this._data = data;
}


// -- inspector UI --

this.inspectorUIDefinition = [
  {
    "type": "textinput",
    "id": "apiKey",
    "label": "apiKey",
    "actionBinding": "this.onUIChange"
  },
  {
    "type": "textinput",
    "id": "projectId",
    "label": "projectId",
    "actionBinding": "this.onUIChange"
  },
  {
    "type": "textinput",
    "id": "messageSenderId",
    "label": "messageSenderId",
    "actionBinding": "this.onUIChange"
  }
];

this._uiTextFields = [ 'apiKey', 'projectId', 'messageSenderId' ];
this._uiCheckboxes = [];
this._uiNumberFields = [];
this._uiColorPickers = [];
this._uiComponentPickers = [];

this._accessorForDataKey = function(key) {
  if (this._uiTextFields.includes(key)) return 'text';
  else if (this._uiCheckboxes.includes(key)) return 'checked';
  else if (this._uiNumberFields.includes(key)) return 'numberValue';
  else if (this._uiColorPickers.includes(key)) return 'rgbaArrayValue';
  else if (this._uiComponentPickers.includes(key)) return 'componentName';
  return null;
}

this.onCreateUI = function() {
  var ui = this.getUI();
  for (var controlId in this._data) {
    var prop = this._accessorForDataKey(controlId);
    if (prop) {
      try {
      	ui.getChildById(controlId)[prop] = this._data[controlId];
      } catch (e) {
        console.log("** can't set ui value for key "+controlId+", prop "+prop);
      }
    }
  }
}

this.onUIChange = function(controlId) {
  var ui = this.getUI();
  var prop = this._accessorForDataKey(controlId);
  if (prop) {
    this._data[controlId] = ui.getChildById(controlId)[prop];
  } else {
    console.log("** no data property found for controlId "+controlId);
  }
}


// -- plugin preview --

this.renderIcon = function(canvas) {
  this._renderPreview(canvas, false);
};

this.renderEditingCanvasPreview = function(canvas, controller) {
  this._renderPreview(canvas, true);
}

this._renderPreview = function(canvas, showText) {
  var ctx = canvas.getContext('2d');
  var w = canvas.width;
  var h = canvas.height;
  ctx.save();
  
  if (showText) {  // fill background with color
    ctx.beginPath();
    ctx.rect(0, 0, w, h);
    ctx.fillStyle = "#D0D0D0";
    ctx.fill();
  }
  
  if (this.icon == null) {
    var path = Plugin.getPathForResource("firebase-auth.png");
    this.icon = Plugin.loadImage(path);
  }
  if (this.icon) {
    var iconW = this.icon.width;
    var iconH = this.icon.height;
    var aspectScale = Math.min(w/iconW, h/iconH);
    var scale = (showText ? 0.7 : 0.6) * aspectScale; // add some margin around icon
    iconW *= scale;
    iconH *= scale;
    ctx.save();
    ctx.globalAlpha = (showText) ? 0.8 : 0.5;
    ctx.drawImage(this.icon, (w-iconW)/2, (h-iconH)/2, iconW, iconH);    
    ctx.restore();
  }

  if (showText) {  // render a label at the bottom
    var fontSize = (h > 40) ? 30 : 15;
    ctx.fillStyle = "#ffffff";
    ctx.font = fontSize+"px Helvetica";
    ctx.textAlign = "center";
    ctx.fillText("Firebase Auth", w*0.5, h - fontSize/3);
  }

  ctx.restore();
}


// -- code generation, React web --

this.getReactWebPackages = function() {
  // Return dependencies that need to be included in the exported project's package.json file.
  // Each key is an npm package name that must be imported, and the value is the package version.
  // 
  // Example:
  //    return { "somepackage": "^1.2.3" }
  
  return {
    "react-firebaseui": "^1.1.8",
    "firebase": "^4.10.1"
  };
}

this.getReactWebImports = function(exporter) {
	var arr = [
    { varName: "StyledFirebaseAuth", path: "react-firebaseui/StyledFirebaseAuth" },
    { varName: "firebase", path: "firebase" }
  ];
	
	return arr;
}

this.getReactWebComponentName = function() {
  // Preferred class name for this component.
  // The exporter may still need to modify this (e.g. if there already is a component by this name),
  // so in the actual export method below, we must use the className value provided as a parameter.
  return "FirebaseAuth";
}

this.exportAsReactWebComponent = function(className, exporter) {
  var template = Plugin.readResourceFile("templates-web/component-template.js", 'utf8');
  
  var view = {
    "CLASSNAME": className,
    "APIKEY": this._data.apiKey,
    "PROJECTID": this._data.projectId,
    "MESSAGESENDERID": this._data.messageSenderId
  }
  var code = this.Mustache.render(template, view);

  exporter.writeSourceCode(className+".js", code);
}

