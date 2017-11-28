
# Lime Field client

[![NPM version][npm-image]][npm-url]
[![NPM downloads][downloads-image]][downloads-url]

## Installation

```sh
npm install --save lime-field-client
```

## Usage


### Configure your client

To make it easy to work with the Lime Field API we have created a small client.
You need to configure a client to point at a specific installation of Lime Field.

```javascript
  var field = require('lime-field-client')('installation', 'username', 'password');
```

All examples below expect that you have setup a field object to work against.


### Make get requests

To read data from the API you can execute get requests quite easily.
The get method returns a promise that resolves with the JSON result for the
get request.

```javascript
  field.get('cases/?modifiedSince=2017-11-20').then(console.log)
```

To see which endpoints you can read from we recommend the documentation for
your specific installation of Lime Field.

### Modify data using commands

Lime Field's API borrows from the CQRS idea of using commands to modify data.
That way the read-model can be optimized for read, and the write model can
more closely follow the Domain Model, and or be optimized for writing.

Which commands you can execute are available in the documentation of your
Lime Field installation.

#### A single command

```javascript
  // To create a simple case
  field.command('CreateCase').
        parameter('Title', 'My first case').
        post().
        then(console.log);
```



#### The command builder pattern

To make it easy to create the command structures the Lime Field client has a
builder pattern allowing you to create commands that follow the expected
structure with ease.


```javascript
    // To start building a command structure you need to specify which command
    // you want to create
    var command = field.command('name');

    // Most commands require a target, this is set with the target method
    command.target('target id');

    // Adding parameters can be done multiple times with different parameters
    command.parameter('name', 'value');

    // the parameter function also accepts arrays for multivalue parameters
    command.parameter('name', ['value1', 'value2']);

    // if you want to execute a single command against the server you use the
    // post method. The method returns a promise with the results.
    command.post();

    // if you want to create a batch of commands you need to build the
    // json structure for each command, this is done with the build method.
    command.build();

```

#### To execute a command batch

One of the benefits of working with a separated write model is that you can
have write specific behaviour.

In our case this means that we support executing many data manipulations in
a single transaction.

We do this by wrapping all the commands we want to have exectued with
transactionall safety inside a command batch.

```javascript

  // simply pass an array of built commands to the postCommands method
  field.postCommands([
    field.command('CreateCase').parameter('Title', 'Case 1').build(),
    field.command('CreateCase').parameter('Title', 'Case 2').build()]
  );
```

This means that if any of the commands fail, none of the commands will be
written.


## License

MIT
