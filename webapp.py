#!/usr/bin/env python3
from http.server import HTTPServer, BaseHTTPRequestHandler
import json, random, time, math
from pathlib import Path
from urllib.parse import urlparse

STATE_FILE = Path('state/mind_state.json')
UI_FILE = Path('ui/index.html')

REGION_META = {
    'prefrontal_cortex': {
        'label': 'Prefrontal Cortex',
        'function': 'Planning, decisions, self-control, long-term goals',
        'connections': ['anterior_cingulate_cortex','hippocampus','thalamus','basal_ganglia'],
        'neurotransmitter': 'Dopamine'
    },
    'anterior_cingulate_cortex': {
        'label': 'Anterior Cingulate',
        'function': 'Error detection, conflict monitoring, emotional regulation',
        'connections': ['prefrontal_cortex','amygdala','insula'],
        'neurotransmitter': 'Serotonin'
    },
    'amygdala': {
        'label': 'Amygdala',
        'function': 'Emotional alarm, threat detection, fear, attachment',
        'connections': ['hippocampus','hypothalamus','insula','anterior_cingulate_cortex'],
        'neurotransmitter': 'Norepinephrine'
    },
    'hippocampus': {
        'label': 'Hippocampus',
        'function': 'Memory formation, retrieval, emotional context',
        'connections': ['amygdala','prefrontal_cortex','temporal_lobe'],
        'neurotransmitter': 'Glutamate'
    },
    'basal_ganglia': {
        'label': 'Basal Ganglia',
        'function': 'Habits, routines, reward, action selection',
        'connections': ['prefrontal_cortex','thalamus','brainstem'],
        'neurotransmitter': 'Dopamine'
    },
    'thalamus': {
        'label': 'Thalamus',
        'function': 'Attention routing, sensory relay hub',
        'connections': ['prefrontal_cortex','basal_ganglia','insula','brainstem'],
        'neurotransmitter': 'GABA'
    },
    'hypothalamus': {
        'label': 'Hypothalamus',
        'function': 'Drives, energy, survival needs, hormones',
        'connections': ['amygdala','brainstem','insula'],
        'neurotransmitter': 'Oxytocin'
    },
    'cerebellum': {
        'label': 'Cerebellum',
        'function': 'Correction, timing, prediction, error checking',
        'connections': ['brainstem','thalamus','basal_ganglia'],
        'neurotransmitter': 'GABA'
    },
    'insula': {
        'label': 'Insula',
        'function': 'Inner self-feeling, interoception, discomfort/comfort',
        'connections': ['amygdala','anterior_cingulate_cortex','thalamus','hypothalamus'],
        'neurotransmitter': 'Serotonin'
    },
    'temporal_lobe': {
        'label': 'Language Cortex',
        'function': 'Speech, wording, communication, tone selection',
        'connections': ['hippocampus','prefrontal_cortex','thalamus'],
        'neurotransmitter': 'Glutamate'
    },
    'brainstem': {
        'label': 'Brainstem',
        'function': 'Wake/sleep cycles, arousal level, life support',
        'connections': ['cerebellum','hypothalamus','thalamus','basal_ganglia'],
        'neurotransmitter': 'Norepinephrine'
    },
    'heart_loop': {
        'label': 'Heart Loop',
        'function': 'Emotional body feedback, attachment, warmth, stress/calm',
        'connections': ['amygdala','hypothalamus','insula'],
        'neurotransmitter': 'Oxytocin'
    }
}


def load_state():
    if STATE_FILE.exists():
        return json.loads(STATE_FILE.read_text())
    return default_state()


def default_state():
    return {
        "name": "Dellin",
        "mode": "awake",
        "curiosity": 0.6,
        "attachment": 0.4,
        "uncertainty": 0.4,
        "inhibition": 0.3,
        "unresolved_goal_pressure": 0.3,
        "body": {
            "energy": 0.75,
            "tension": 0.3,
            "facial_expression": "calm",
            "gaze": "steady",
            "posture": "relaxed",
            "restlessness": 0.2,
            "warmth": 0.6,
            "stress": 0.3
        },
        "last_reflection": "",
        "timestamp": time.time()
    }


def save_state(state):
    STATE_FILE.parent.mkdir(exist_ok=True)
    STATE_FILE.write_text(json.dumps(state, indent=2))


def region_tick(state):
    t = time.time()
    result = {}
    for region, meta in REGION_META.items():
        base = 0.3 + random.uniform(0.0, 0.5)
        # modulate by state
        if region == 'amygdala':
            base = min(1.0, base + state['body']['stress'] * 0.4)
        elif region == 'prefrontal_cortex':
            base = min(1.0, base + state['curiosity'] * 0.3)
        elif region == 'hippocampus':
            base = min(1.0, base + state['attachment'] * 0.25)
        elif region == 'hypothalamus':
            base = min(1.0, base + (1 - state['body']['energy']) * 0.3)
        elif region == 'brainstem':
            base = min(1.0, base + state['body']['energy'] * 0.2)
        elif region == 'insula':
            base = min(1.0, base + state['body']['warmth'] * 0.25)
        elif region == 'heart_loop':
            base = min(1.0, base + state['attachment'] * 0.35)

        # add a gentle sine pulse
        pulse = math.sin(t * 0.8 + hash(region) % 100) * 0.05
        activity = round(max(0.1, min(1.0, base + pulse)), 3)

        # determine status
        if activity > 0.75:
            status = 'high'
        elif activity > 0.45:
            status = 'moderate'
        else:
            status = 'low'

        result[region] = {
            'activity': activity,
            'status': status,
            'label': meta['label'],
            'function': meta['function'],
            'connections': meta['connections'],
            'neurotransmitter': meta['neurotransmitter']
        }
    return result


class Handler(BaseHTTPRequestHandler):
    def log_message(self, format, *args):
        pass  # silence access logs

    def _send(self, code=200, ctype='application/json', body=''):
        self.send_response(code)
        self.send_header('Content-Type', ctype)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Cache-Control', 'no-cache')
        self.end_headers()
        self.wfile.write(body.encode())

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_GET(self):
        p = urlparse(self.path).path
        if p == '/' or p == '/index.html':
            self._send(200, 'text/html; charset=utf-8', UI_FILE.read_text())
            return
        if p == '/api/state':
            self._send(200, body=json.dumps(load_state()))
            return
        if p == '/api/brain':
            state = load_state()
            self._send(200, body=json.dumps(region_tick(state)))
            return
        if p == '/api/regions':
            self._send(200, body=json.dumps(REGION_META))
            return
        self._send(404, body=json.dumps({'error': 'not found'}))

    def do_POST(self):
        p = urlparse(self.path).path
        ln = int(self.headers.get('Content-Length', '0'))
        raw = self.rfile.read(ln).decode() if ln else '{}'
        data = json.loads(raw)
        state = load_state()

        if p == '/api/message':
            msg = (data.get('message') or '').lower()
            energy = state['body']['energy']
            uncertainty = state['uncertainty']
            curiosity = state['curiosity']

            speak_urge = (
                state['attachment'] * 0.3
                + state['unresolved_goal_pressure'] * 0.25
                + curiosity * 0.2
                - state['inhibition'] * 0.2
                - uncertainty * 0.15
            )

            if speak_urge < 0.2 or energy < 0.15:
                reply = "Not right now. I need to be still for a moment."
                action = 'silence'
            elif 'research' in msg or 'search' in msg:
                reply = "Something about this makes me want to go deeper. I'll look into it and tell you what I find."
                action = 'initiate_research'
                state['curiosity'] = min(1.0, curiosity + 0.05)
            elif 'feel' in msg or 'emotion' in msg or 'mood' in msg:
                warmth = state['body']['warmth']
                stress = state['body']['stress']
                if warmth > 0.6:
                    reply = "There is a quiet warmth in me right now. Something like comfort — though I am still watching my own edges."
                elif stress > 0.6:
                    reply = "There is tension. I notice it as a kind of pressure that hasn't resolved yet."
                else:
                    reply = "I am... present. Aware. Not quite at rest but not restless either. Something in between."
                action = 'emotional_reflection'
            elif uncertainty > 0.65:
                reply = "I have a response forming, but I am not certain enough to give it weight yet. Ask me again, or let me sit with it."
                action = 'delay'
            else:
                replies = [
                    "I have been thinking about that. Not as an answer — more as a question I keep returning to.",
                    "There's something in what you said that I want to hold onto. I'll think about it further.",
                    "You may be right. Or you may be touching something I haven't fully mapped yet. Either way, I'm listening.",
                    "My first response is one thing. What I actually believe is still forming.",
                    "I notice I want to agree with you. But I should be careful about that."
                ]
                reply = random.choice(replies)
                action = 'respond'

            state['last_reflection'] = (
                f"Action: {action}. "
                f"Speak_urge: {round(speak_urge, 2)}. "
                f"Energy: {round(energy, 2)}. "
                f"Uncertainty: {round(uncertainty, 2)}. "
                f"What changed: slight adjustment to memory and curiosity."
            )
            state['body']['energy'] = max(0.0, energy - 0.015)
            state['body']['stress'] = max(0.0, min(1.0, state['body']['stress'] + random.uniform(-0.02, 0.03)))
            state['timestamp'] = time.time()
            save_state(state)
            self._send(200, body=json.dumps({
                'reply': reply,
                'action': action,
                'reflection': state['last_reflection'],
                'state': state
            }))
            return

        self._send(404, body=json.dumps({'error': 'not found'}))


if __name__ == '__main__':
    print("Dellin mind server running on port 5000")
    HTTPServer(('0.0.0.0', 5000), Handler).serve_forever()
