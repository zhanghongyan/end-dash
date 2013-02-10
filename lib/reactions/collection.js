var Parser = require("../parser")
  , Reaction = require("../reaction")
  , inflection = require("../inflection")
  , _ = require("underscore")
  , get = require("../util").get

var CollectionReaction = Reaction.extend({
  selector: "[class]",

  reactIf: function(el) {
    return _($(el).attr("class").split(/\s/)).any(function(className) {
      if(!className || !className.match(/-$/)) return

      childClassName = inflection.singularize(className.slice(0, -1))
      var children = el.children("." + childClassName + "-").length > 0
      if(children) {
        this.state.collectionName = className.slice(0, -1)
        return true
      }
    }, this)
  },

  parse: function(el) {
    this.state.itemTemplate = (new Parser(el.children())).generate()
    el.children().remove()
    el.append($("<div>").attr("class", inflection.singularize(this.state.collectionName) + "-"))
  },

  addAll: function(container, models, opts) {
    opts = opts || {}
    if(_.isArray(models)) {
      models = _(models)
    }
    models.each(function(item, index) {
      var at = opts && opts.at + index
      this.add(container, item, { at: at })
    }, this)
  },

  add: function(container, model, opts) {
    var Template = this.state.itemTemplate
      , children = container.children()
      , template = new Template(model)
      , opts = {}

    if(typeof opts.at === "undefined") {
      container.append(template.template)
    } else if(opts.at === 0) {
      container.prepend(template.template)
    } else {
      template.template.insertAfter(children[opts.at - 1])
    }
  },

  setupScope: function(el, model, modelStack) {
    var collection = get(model, this.state.collectionName)
    modelStack.push(collection)
  },
 
  init: function(container, collection) {
    container.data("collection", collection).html("")
    this.addAll(container, collection)
  },

  observe: function(container, collection) {
    collection.on("sort reset", function(collection) {
      this.addAll(container.html(""), collection)
    }, this)

    collection.on("add", function(model, collection) {
      this.add(container, model, { at: collection.indexOf(model) })
    }, this)

    collection.on("remove", function(model, collection, opts) {
      container.children().eq(opts.index).remove()
    }) 
  }
})

module.exports = CollectionReaction