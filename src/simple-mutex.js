module.exports = class Mutex {
	// ----------------------------------------------------
	// private members
	#fOk = ()=>{};
	#p = Promise.resolve();
	
	// ----------------------------------------------------
	// getting / locking
	fpGet() {
		const self = this;

		const pOut = this.#p;
		
		this.#p = this.#p.then( () => {
			return new Promise(( fOk ) => {
				self.#fOk = fOk;
			});
		});

		return pOut;
	}
	lock = this.fpGet;
	get = this.fpGet;
	
	// ----------------------------------------------------
	// release() / unlock()
	fRelease() {
		this.#fOk();
	}
	release = this.fRelease;
	unlock = this.fRelease;
	
	
	// ----------------------------------------------------
	// runExclusively / criticalSection / run
	async fpRunExclusively( fp, ...vx ){
		await this.fpGet();
		await fp( ...vx );
		this.fRelease();
	}
	criticalSection = this.fpRunExclusively;
	runExclusively = this.fpRunExclusively;
	run = this.fpRunExclusively;
	

	// ----------------------------------------------------
	// Mutex.lock()
	static async fpGet( o ) {
		o.mutex ??= new Mutex();
		return o.mutex.fpGet();
	}
	static get = Mutex.fpGet;
	static lock = Mutex.fpGet;
	
	// ----------------------------------------------------
	// Mutex.release()
	static fRelease( o ){
		o.mutex ??= new Mutex();
		return o.mutex.fRelease();
	}
	static release = Mutex.fRelease;

	// ----------------------------------------------------
	// Mutex.cancel()
	static fCancel( o ){
		o.mutex ??= new Mutex();
		return o.mutex.fCancel();
	}
	
	// ----------------------------------------------------
	// Mutex.runExclusively()
	static async fpRunExclusively( fp, ...vx ) {
		fp.mutex ??= new Mutex();
		return fp.mutex.fpRunExclusively( fp, ...vx );
	}
	static run = Mutex.fpRunExclusively;
	static criticalSection = Mutex.fpRunExclusively;
	static runExclusively = Mutex.fpRunExclusively;

	// ----------------------------------------------------
	// Mutex.makeExclusive()
	// convert a normal fuction into a one-at-a-time function
	// that can only be run exclusively
	static ffpMakeExclusive( fpOrig ) {
		const mutex = new Mutex();
		
		return function fpNew( ...vx ){
			mutex.fpRunExclusively( fpOrig, ...vx );
		};
	}
	
	static makeExclusive = Mutex.ffpMakeExclusive;
	
}

