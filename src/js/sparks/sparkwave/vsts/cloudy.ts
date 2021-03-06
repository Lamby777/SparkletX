/*
* Cloudy, a free open-source oscillator synth for Sparkwave
* Made by DexieTheSheep for Sparklet
* Licensed under GPLv3
*/

"use strict";

import {VST}				from "../classes";
import {noteHz}				from "../main";
import {Rectangle, Text}	from "../dtools";

const border = 4;

export default class Cloudy extends VST {
	private oscs:		OscNote[][] = [[]];
	private bg:			Rectangle;
	
	constructor(ctx: AudioContext) {
		super(ctx);
		
		this.bg = new Rectangle(
			this.x+border,
			this.y+border,
			this.w-(2*border),
			this.h-(2*border),
		);

		this.bg.color = "aliceblue";
	}
	
	draw(c: CanvasRenderingContext2D) {
		this.bg.draw(c);
	}

	updateDisplay() {
		[this.bg.x, this.bg.y] = [this.x+border, this.y+border];
	}

	override onMidiInput(	command:	number,
							note:		number,
							velocity:	number) {
		switch (command) {
			case 144: // Note ON
				if (velocity > 0) this.noteOn(note, velocity);
				else this.noteOff(note);
				break;
				
			case 128: // Note OFF
				this.noteOff(note);
				break;
		}
	}

	override noteOn(note: number, velocity: number) {
		const oscn = new OscNote(note, this.makeOscillator(0));
		oscn.osc.frequency.value = noteHz(note);

		this.oscs[0].push(oscn);
		
		oscn.osc.connect(this.ctx.destination);
		oscn.osc.start();
	}

	override noteOff(note: number) {
		for (const section of this.oscs) {
			section.forEach((oscn, i) => {
				// For each oscillator/note container,
				// Check if it's playing the note we want to end
				if (oscn.note !== note) return;
				
				oscn.osc.stop();
				oscn.osc.disconnect(this.ctx.destination);

				section.splice(i);
			});
		}
	}

	makeOscillator(section: number): OscillatorNode {
		return new OscillatorNode(this.ctx, {
			type: "square",
		});
	}
}

class OscNote {
	constructor(
		public note:	number,
		public osc:		OscillatorNode,
	) {}
}
