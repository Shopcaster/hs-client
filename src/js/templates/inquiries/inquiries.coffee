
dep.require 'hs.Template'
dep.require 'zz'

dep.provide 'hs.t.Inquiries'

class hs.t.Inquiries extends hs.Template

  template: -> div class: 'inquiry-list'


  subTemplates:
    inquiry:
      class: hs.t.Inquiry
      appendTo: '.inquiry-list'


  addModel: (id, index) ->
    zz.data.inquiry id, (inquiry) =>
      this.inquiryTmpl inquiry, {nthChild: index}


  removeModel: (id, index) ->
    this.removeTmpl index

