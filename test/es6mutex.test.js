const Mutex = require( "../src/es6mutex.js" );

test("ensure lock works", async () => {

	const mutex = new Mutex();
	
	let s="";
	function ftmNow(){
		return new Date ().getTime ();
	}

	function wait( dtm ){
		return new Promise( fOk => setTimeout( fOk, dtm ));
	}
	
	let tm = ftmNow();
	async function f() {
		await mutex.lock();
		await wait(100);
		s=s+Math.round((ftmNow() - tm)/100) + ",";
		mutex.unlock();
	}
	
	// these will run serially, one per second
	f();
	f();
	f();
	f();
	await mutex.lock();

	expect(s).toBe( "1,2,3,4," );
});
		 

	
