const explorer = require("../../../../locators/explorerlocators.json");

describe("Label feature", () => {
  before(() => {
    cy.get(explorer.addWidget).click();
  });

  it("CheckboxGroupWidget label properties: Text, Position, Alignment, Width", () => {
    const options = {
      widgetName: "checkboxgroupwidget",
<<<<<<< HEAD
      parentColumnSpace: 11.90625,
=======
      parentColumnSpace: 11.9375,
>>>>>>> 3cb8d21c1b37c8fb5fb46d4b1b4bce4e6ebfcb8f
      containerSelector: "[data-testid='checkboxgroup-container']",
      isCompact: true,
      labelText: "Name",
      labelWidth: 4,
    };

    cy.checkLabelForWidget(options);
  });

  it("CurrencyInputWidget label properties: Text, Position, Alignment, Width", () => {
    const options = {
      widgetName: "currencyinputwidget",
<<<<<<< HEAD
      parentColumnSpace: 11.90625,
=======
      parentColumnSpace: 11.9375,
>>>>>>> 3cb8d21c1b37c8fb5fb46d4b1b4bce4e6ebfcb8f
      containerSelector: "[data-testid='input-container']",
      isCompact: true,
      labelText: "Name",
      labelWidth: 4,
    };

    cy.checkLabelForWidget(options);
  });

  it("DatePickerWidget2 label properties: Text, Position, Alignment, Width", () => {
    const options = {
      widgetName: "datepickerwidget2",
<<<<<<< HEAD
      parentColumnSpace: 11.90625,
=======
      parentColumnSpace: 11.9375,
>>>>>>> 3cb8d21c1b37c8fb5fb46d4b1b4bce4e6ebfcb8f
      containerSelector: "[data-testid='datepicker-container']",
      isCompact: true,
      labelText: "Name",
      labelWidth: 4,
    };

    cy.checkLabelForWidget(options);
  });

  it("InputWidgetV2 label properties: Text, Position, Alignment, Width", () => {
    const options = {
      widgetName: "inputwidgetv2",
<<<<<<< HEAD
      parentColumnSpace: 11.90625,
=======
      parentColumnSpace: 11.9375,
>>>>>>> 3cb8d21c1b37c8fb5fb46d4b1b4bce4e6ebfcb8f
      containerSelector: "[data-testid='input-container']",
      isCompact: true,
      labelText: "Name",
      labelWidth: 4,
    };

    cy.checkLabelForWidget(options);
  });

  it("MultiSelectTreeWidget label properties: Text, Position, Alignment, Width", () => {
    const options = {
      widgetName: "multiselecttreewidget",
<<<<<<< HEAD
      parentColumnSpace: 11.90625,
=======
      parentColumnSpace: 11.9375,
>>>>>>> 3cb8d21c1b37c8fb5fb46d4b1b4bce4e6ebfcb8f
      containerSelector: "[data-testid='multitreeselect-container']",
      isCompact: true,
      labelText: "Name",
      labelWidth: 4,
    };

    cy.checkLabelForWidget(options);
  });

  it("MultiSelectWidgetV2 label properties: Text, Position, Alignment, Width", () => {
    const options = {
      widgetName: "multiselectwidgetv2",
<<<<<<< HEAD
      parentColumnSpace: 11.90625,
=======
      parentColumnSpace: 11.9375,
>>>>>>> 3cb8d21c1b37c8fb5fb46d4b1b4bce4e6ebfcb8f
      containerSelector: "[data-testid='multiselect-container']",
      isCompact: true,
      labelText: "Name",
      labelWidth: 4,
    };

    cy.checkLabelForWidget(options);
  });

  it("PhoneInputWidget label properties: Text, Position, Alignment, Width", () => {
    const options = {
      widgetName: "phoneinputwidget",
<<<<<<< HEAD
      parentColumnSpace: 11.90625,
=======
      parentColumnSpace: 11.9375,
>>>>>>> 3cb8d21c1b37c8fb5fb46d4b1b4bce4e6ebfcb8f
      containerSelector: "[data-testid='input-container']",
      isCompact: true,
      labelText: "Name",
      labelWidth: 4,
    };

    cy.checkLabelForWidget(options);
  });

  it("RadioGroupWidget label properties: Text, Position, Alignment, Width", () => {
    const options = {
      widgetName: "radiogroupwidget",
<<<<<<< HEAD
      parentColumnSpace: 11.90625,
=======
      parentColumnSpace: 11.9375,
>>>>>>> 3cb8d21c1b37c8fb5fb46d4b1b4bce4e6ebfcb8f
      containerSelector: "[data-testid='radiogroup-container']",
      isCompact: true,
      labelText: "Name",
      labelWidth: 4,
    };

    cy.checkLabelForWidget(options);
  });

  it("RichTextEditorWidget label properties: Text, Position, Alignment, Width", () => {
    const options = {
      widgetName: "richtexteditorwidget",
<<<<<<< HEAD
      parentColumnSpace: 11.90625,
=======
      parentColumnSpace: 11.9375,
>>>>>>> 3cb8d21c1b37c8fb5fb46d4b1b4bce4e6ebfcb8f
      containerSelector: "[data-testid='rte-container']",
      isCompact: false,
      labelText: "Name",
      labelWidth: 4,
    };

    cy.checkLabelForWidget(options);
  });

  it("SelectWidget label properties: Text, Position, Alignment, Width", () => {
    const options = {
      widgetName: "selectwidget",
<<<<<<< HEAD
      parentColumnSpace: 11.90625,
=======
      parentColumnSpace: 11.9375,
>>>>>>> 3cb8d21c1b37c8fb5fb46d4b1b4bce4e6ebfcb8f
      containerSelector: "[data-testid='select-container']",
      isCompact: true,
      labelText: "Name",
      labelWidth: 4,
    };

    cy.checkLabelForWidget(options);
  });

  it("SingleSelectTreeWidget label properties: Text, Position, Alignment, Width", () => {
    const options = {
      widgetName: "singleselecttreewidget",
<<<<<<< HEAD
      parentColumnSpace: 11.90625,
=======
      parentColumnSpace: 11.9375,
>>>>>>> 3cb8d21c1b37c8fb5fb46d4b1b4bce4e6ebfcb8f
      containerSelector: "[data-testid='treeselect-container']",
      isCompact: true,
      labelText: "Name",
      labelWidth: 4,
    };

    cy.checkLabelForWidget(options);
  });

  it("SwitchGroupWidget label properties: Text, Position, Alignment, Width", () => {
    const options = {
      widgetName: "switchgroupwidget",
<<<<<<< HEAD
      parentColumnSpace: 11.90625,
=======
      parentColumnSpace: 11.9375,
>>>>>>> 3cb8d21c1b37c8fb5fb46d4b1b4bce4e6ebfcb8f
      containerSelector: "[data-testid='switchgroup-container']",
      isCompact: true,
      labelText: "Name",
      labelWidth: 4,
    };

    cy.checkLabelForWidget(options);
  });
});
