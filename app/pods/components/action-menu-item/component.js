import Ember from 'ember';

export default Ember.Component.extend({
  icon: 'fa-square',
  label: '',
  enabled: true,
  actionArg: null,
  altActionArg: null,

  tagName: 'a',
  classNameBindings: ['enabled::hide'],

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
    buffer.push('<i class="fa fa-fw '+ this.get('icon') + '"></i> ' + this.get('label'));
  },

  iconChanged: function() {
    this.rerender();
  }.observes('icon'),
});
