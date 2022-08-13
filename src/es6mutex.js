class Mutex {
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
	
	// ----------------------------------------------------
	// release() / unlock()
	fRelease() {
		this.#fOk();
	}
	
	// ----------------------------------------------------
	// runExclusively / criticalSection / run
	async fpRunExclusively( fp, ...vx ){
		await this.fpGet();
		const x = await fp( ...vx );
		this.fRelease();
		return x;
	}

	// ----------------------------------------------------
	// Mutex.lock()
	static async fpGet( o ) {
		o.mutex ??= new Mutex();
		return o.mutex.fpGet();
	}
	
	// ----------------------------------------------------
	// Mutex.release()
	static fRelease( o ){
		o.mutex ??= new Mutex();
		return o.mutex.fRelease();
	}

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

	// ----------------------------------------------------
	// Mutex.makeExclusive()
	// convert a normal fuction into a one-at-a-time function
	// that can only be run exclusively
	static ffpMakeExclusive( fpOrig ) {
		return Mutex.fpRunExclusively.bind( undefined, fpOrig );
	}
	
}

// aliases
Mutex.prototype.lock = Mutex.prototype.fpGet;
Mutex.prototype.get = Mutex.prototype.fpGet;

Mutex.prototype.release = Mutex.prototype.fRelease;
Mutex.prototype.unlock = Mutex.prototype.fRelease;

Mutex.prototype.criticalSection = Mutex.prototype.fpRunExclusively;
Mutex.prototype.runExclusively = Mutex.prototype.fpRunExclusively;
Mutex.prototype.run = Mutex.prototype.fpRunExclusively;

Mutex.get = Mutex.fpGet;
Mutex.lock = Mutex.fpGet;
Mutex.release = Mutex.fRelease;
Mutex.run = Mutex.fpRunExclusively;
Mutex.criticalSection = Mutex.fpRunExclusively;
Mutex.runExclusively = Mutex.fpRunExclusively;
Mutex.makeExclusive = Mutex.ffpMakeExclusive;

module.exports = Mutex;
