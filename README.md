# simple-mutex.js

Simple, dependency free Mutex tools for ES6.

## INSTALLATION

```
npm install simple-mutex
```

### OVERVIEW

Simple-mutex can be used as either a class or a library:


## USAGE AS A CLASS TO LOCK AGAINST A DEDICATED OBJECT

```javascript

const Mutex = require( "simple-mutex" );

const mutex = new Mutex();

async function f() {
	await mutex.lock();
	await wait(1000);
	console.log( "Here" );
	mutex.unlock();
}

// these will run serially, one per second
f();
f();
f();
f();

```


## USAGE AS A LIBRARY TO LOCK AGAINST ANY OBJECT

```javascript

const Mutex = require( "simple-mutex" );

async function sendAndReceive( serialport ) {
	await Mutex.lock( serialport );
	serialport.send( "some long message ");
	let s = await serialport.read( );
	mutex.unlock( serialport );
	return s;
}

// these will run serially
sendAndReceive( serialport )
sendAndReceive( serialport ) 

```


## USE FUNCTIONS EXCLUSIVELY (NON-REENTRANT)

```javascript

const Mutex = require( "simple-mutex" );

async function f( s ) {
	await wait(1000);
	console.log( s );
}

// these will run serially, one per second
Mutex.runExclusively( f, "Hello," );
Mutex.runExclusively( f, "World! );
```


## CRATE EXCLUSIVE (NON-REENTRANT) FUNCTIONS

```javascript

const Mutex = require( "simple-mutex" );

async function f( s ) {
	await wait(1000);
	console.log( s );
}

const exclusiveFunc = Mutex.makeExclusive ( f );

// these will run serially, one per second
exclusiveFunc( "Hello," ), 
exclusiveFunc( "World!" ), 

```



# API

## Class API

### Mutex.prototpye.get()
### Mutex.prototpye.lock()
### Mutex.prototpye.fpGet()

Returns a promise which is resolved when control over the mutex is obtained.

Use with await

```javascript
const mutex = new Mutex();
await mutex.get();
// do whatever 
``

or with Promise chains:

```javascript
 mutex.get().then( /* do whatever */ );
```
 
 
 
### Mutex.prototpye.release()
### Mutex.prototpye.unlock()
### Mutex.prototpye.fpRelease()

Releases control over the mutex object allowing the next tasks waiting for control to proceed.

```javascript
const mutex = new Mutex();
await mutex.get();
// do whatever 
mutex.release();
``

### Mutex.prototpye.runExclusively( f, ...args )
### Mutex.prototpye.criticalSection( f, ...args )
### Mutex.prototpye.run( f, ...args )
### Mutex.prototpye.fpRunExclusively( f, ...args )

Gets control over the mutex, waits for resolution of the passed in function `f` called with the arguments `...args`, releases the mutex.

Note, with this form, the lock is bound to the mutex instance, so the function could be called from elsewhere without the lock or with a different lock.

```javascript
mutex.run( somePromiseFunction, arg1, arg2 );
// do whatever 
``



## Library API

### Mutex.get( o )
### Mutex.lock( o )
### Mutex.fpGet( o )

Links a mutex to the object `o`,  and returns a promise which is resolved 
when control over the mutex is obtained.

Use with await

```javascript
const o = {};
await Mutex.get( o );
// do whatever 
``

or with Promise chains:

```javascript
const o = {};
 mutex.get( o ).then( /* do whatever */ );
```
 
 
### Mutex.release( o )
### Mutex.unlock( o )
### Mutex.fpRelease( o )

Unlocks a mutex which has been bound to the given object, immediately allowing any tasks waiting for control of that mutex to proceed.

```javascript
const o = {};
await Mutex.get( o );
// do whatever 
Mutex.release( o );
```

### Mutex.runExclusively( f, ...args )
### Mutex.criticalSection( f, ...args )
### Mutex.run( f, ...args )
### Mutex.fpRunExclusively( f, ...args )

Binds a mutex to the given function if one has not already been attached, and then waits for control before executing the function with the provided args

```javascript
Mutex.run( somePromiseFunction, arg1, arg2 );
Mutex.run( somePromiseFunction, arg1, arg2 );
```



### Mutex.makeExclusive( f )
### Mutex.ffpMakeExclusive( f )

Returns a version of the provided function which can only be run exclusively (non-reentrant)

```javascript
const f = Mutex.makeExclusive( somePromiseFunction );

f( arg1, arg2 );
f( arg1, arg2 );
```

