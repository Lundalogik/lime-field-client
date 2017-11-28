module.exports = function(client){

  var errorNotificationFromCommands = function (commandBatchResponse) {
    console.console.error(commandBatchResponse.ErrorMessage);
  };

  var createCommandBuilder = function(name) {
    return function() {
      return { Name: name };
    };
  };

  var createTargetBuilder = function( builder ) {
    var build = builder.build;
    return function( target ) {
      var buildWithTarget = function() {
        var command = build();
        command.Target = target;
        return command;
      };
      builder.build = buildWithTarget;
      return builder;
    };
  };

  var extractValueForParameter = function( value ) {
    var returnValue = value !== null && typeof value === 'object' && value.hasOwnProperty('Href') ? value.Href : value;
    if(returnValue === undefined || returnValue === null ) {
      return '';
    }
    return typeof returnValue !== 'string' ? returnValue.toString() : returnValue;
  };

  var createParameterBuilder = function( builder ) {
    return function( name, value ) {
      var build = builder.build;
      var buildWithParameter = function() {
        var command = build();
        command.Parameters = command.Parameters || [];
        var values = value !== undefined && value !== null && value.constructor === Array ? value : [ value ];
        command.Parameters.push( { Name: name, Values: values.map( extractValueForParameter ) } );
        return command;
      };
      builder.build = buildWithParameter;
      return builder;
    };
  };

  var createCommandPoster = function( builder ) {
    return function(success, error ) {
      var errorHandler = error || errorNotificationFromCommands;
      return client.postCommands( [ builder.build() ] );
    };
  };

   return command = function(name) {
    var builder = {
      build: createCommandBuilder( name )
    };
    builder.target = createTargetBuilder( builder );
    builder.parameter = createParameterBuilder( builder );
    builder.parameterIfChanged = createParameterBuilder( builder );
    builder.post = createCommandPoster( builder );
    return builder;
  };
}
