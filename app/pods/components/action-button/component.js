import Ember from 'ember';

export default Ember.Component.extend({
  icon: 'fa-square',
  tooltip: '',
  big: false,
  enabled: true,
  actionArg: null,
  altActionArg: null,

  tagName: 'button',
  type: 'button',
  classNames: ['btn','btn-link'],
  classNameBindings: ['enabled::hide'],
  attributeBindings: ['tooltip'],

  click : function(event) {
    if ( event.altKey && this.get('altActionArg'))
    {
      this.sendAction('action', this.get('altActionArg'));
    }
    else
    {
      this.sendAction('action', this.get('actionArg'));
    }
  },

  render: function(buffer) {
    if ( this.get('big') )
    {
      buffer.push('<span class="fa-stack fa-lg">');
        buffer.push('<i class="fa fa-circle fa-stack-2x"></i>');
        buffer.push('<i class="fa fa-stack-1x fa-inverse '+ this.get('icon') +'"></i>');
      buffer.push('</span>');
    }
    else
    {
      buffer.push('<i class="fa '+ this.get('icon') + '"></i>');
    }
  },

  iconChanged: function() {
    this.rerender();
  }.observes('icon'),
});
