import Ember from 'ember';
import util from 'ui/utils/util';
import C from 'ui/utils/constants';

export default Ember.Controller.extend({
  queryParams: ['timedOut'],

  timedOut: false,
  waiting: false,
  errorMsg: null,

  infoColor: function() {
    if ( this.get('errorMsg') )
    {
      return 'alert-warning';
    }
    {
      return 'alert-info';
    }
  }.property('errorMsg'),

  infoMsg: function() {
    if ( this.get('errorMsg') )
    {
      return this.get('errorMsg');
    }
    else if ( this.get('timedOut') )
    {
      return 'Your session has timed out.  Log in again to continue.';
    }
    else
    {
      return '';
    }
  }.property('timedOut','waiting','errorMsg'),

  actions: {
    authenticate: function() {
      var self = this;
      var session = self.get('session');
      var app = self.get('app');

      self.set('timedOut', false);
      self.set('waiting', true);
      self.set('errorMsg', null);

      self.get('torii').open('github-oauth2',{windowOptions: util.popupWindowOptions()}).then(function(github){
        var headers = {};
        headers[C.AUTH_HEADER] = undefined; // Explictly not send auth
        headers[C.PROJECT_HEADER] = undefined; // Explictly not send project

        return self.get('store').rawRequest({
          url: 'token',
          method: 'POST',
          headers: headers,
          data: {
            code: github.authorizationCode,
          },
        }).then(function(res) {
          var auth = JSON.parse(res.xhr.responseText);
          session.setProperties(auth);
          session.set(C.LOGGED_IN, true);
          var transition = app.get('afterLoginTransition');
          if ( transition )
          {
            app.set('afterLoginTransition', null);
            transition.retry();
          }
          else
          {
            self.transitionToRoute('index');
          }
        });
      })
      .catch(function(res) {
        if ( res.xhr && res.xhr.responseText )
        {
          var body = JSON.parse(res.xhr.responseText);
          self.set('errorMsg', body.message);
        }
        else if ( res.err )
        {
          self.set('errorMsg', res.err);
        }
        else if ( res.message )
        {
          self.set('errorMsg', res.message);
        }
        else
        {
          self.set('errorMsg', res);
        }
      }).finally(function() {
        self.set('waiting', false);
      });
    }
  }
});

