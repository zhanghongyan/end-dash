var generateTemplate = require("./util").generateTemplate
  , Backbone = require("backbone")
  , expect = require("expect.js")
  , _ = require("underscore")
  , fs = require("fs")

describe("When I replace an embedded model", function() {
  it("should change it in the template", function() {
    var subModel = new Backbone.Model({ title: "a title" })
      , model = new Backbone.Model({ subModel: subModel })
      , markup = '<div><div class = "subModel-"><div class = "title-"></div></div></div>'
      , template = generateTemplate(model, markup)
  
    expect($(".title-").html()).to.be("a title")
  
    model.set("subModel", new Backbone.Model({ title: "a new title" }))
  
    expect($(".title-").html()).to.be("a new title")
  })
})
 