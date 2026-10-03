// Browser Speech Synthesis for Agent Voice Output
class AgentVoiceSynthesizer {
  private synth: SpeechSynthesis | null = null;
  private voices: SpeechSynthesisVoice[] = [];
  private isSupported: boolean = false;

  constructor() {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      this.synth = window.speechSynthesis;
      this.isSupported = true;
      this.loadVoices();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.loadVoices();
      }
    }
  }

  private loadVoices() {
    if (this.synth) {
      this.voices = this.synth.getVoices();
    }
  }

  public speak(text: string, agentRole: string, onEnd?: () => void) {
    if (!this.isSupported || !this.synth) return;

    this.synth.cancel(); // cancel any ongoing speech

    // Clean markdown symbols from text before speaking
    const cleanText = text
      .replace(/[*_#`~[\]()]/g, "")
      .replace(/https?:\/\/\S+/g, "")
      .slice(0, 300); // limit speech snippet for fluid experience

    const utterance = new SpeechSynthesisUtterance(cleanText);

    // Pick appropriate voice
    const viVoice = this.voices.find((v) => v.lang.startsWith("vi"));
    if (viVoice) {
      utterance.voice = viVoice;
      utterance.lang = "vi-VN";
    }

    // Role based pitch & rate modulation for distinctive agent personalities
    switch (agentRole) {
      case "ceo":
        utterance.pitch = 0.9;
        utterance.rate = 1.0;
        break;
      case "architect":
        utterance.pitch = 0.85;
        utterance.rate = 1.05;
        break;
      case "cmo":
        utterance.pitch = 1.15;
        utterance.rate = 1.1;
        break;
      case "qa_critic":
        utterance.pitch = 0.95;
        utterance.rate = 0.95;
        break;
      default:
        utterance.pitch = 1.0;
        utterance.rate = 1.0;
    }

    if (onEnd) {
      utterance.onend = onEnd;
      utterance.onerror = onEnd;
    }

    this.synth.speak(utterance);
  }

  public stop() {
    if (this.synth) {
      this.synth.cancel();
    }
  }
}

export const agentVoice = new AgentVoiceSynthesizer();
