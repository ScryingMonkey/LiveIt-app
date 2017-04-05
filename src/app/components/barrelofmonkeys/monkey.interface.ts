export interface Monkey {
    key: string, // How the monkey is summoned from the barrel
	image?: string, // image displayed with blurb
	blurb: string, // What the monkey says.  Ususally a 1-2 sentence solicitation.
	optionType: string, // What kind of responses the monkey offers.  Must be radio or checkbox (for now)
	options: Array<string>,  // The responses the monkey offers
	// TODO: refactor Monkey to be able to accept css buttons
	// TODO: refactor Monkey to be able to accept text input
	responses?: Array<string> // stores the responses to the monkeys options
	leader?: string // Key of the monkey that called this monkey out of the barrel.  If null this is the first monkey.
	followers: Array<string>, // The monkey or monkeys that comes after this monkey.  If null, you are done!
    submit: string,  // label of the submit button
    hat: string // A general description of the monkey's head covering (all monkeys wear hats).
}