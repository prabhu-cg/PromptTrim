export interface SamplePrompt {
  id: string
  label: string
  prompt: string
}

export const SAMPLE_PROMPTS: SamplePrompt[] = [
  {
    id: 'dev-brief',
    label: 'Dev brief',
    prompt:
      "Hey there! So I was thinking, could you please help me build out a user dashboard for our internal admin tool? It should basically show a list of all the users, their email, and when they last logged in. Oh and also, please make sure it does NOT include any billing or payment related stuff, that is totally out of scope for this phase. The dashboard needs to be built using React. Thanks so much, really appreciate the help!",
  },
  {
    id: 'meeting-notes',
    label: 'Meeting notes',
    prompt:
      "Okay so basically in the meeting today we talked about a bunch of stuff. The main thing is we need to write up a summary email to the team about the new onboarding flow. It should mention that the deadline got pushed to next Friday, and that legal still needs to review the terms of service page before we launch. Also please don't mention the pricing changes yet since that's not finalized. Keep it short I guess, nobody reads long emails anyway lol.",
  },
  {
    id: 'marketing-brief',
    label: 'Marketing brief',
    prompt:
      "Hi! I need some help writing marketing copy for our new product launch. It's a productivity app called TaskFlow. Could you maybe write like 3 or 4 taglines for it? It should feel modern and friendly, not too corporate sounding. Also we really don't want to compare it to our competitors directly, our legal team said we can't do that. Thank you so much in advance!!",
  },
]
