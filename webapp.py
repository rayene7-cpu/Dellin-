#!/usr/bin/env python3
from http.server import HTTPServer, BaseHTTPRequestHandler
import json, random
from pathlib import Path
from urllib.parse import urlparse

STATE_FILE = Path('state/mind_state.json')
UI_FILE = Path('ui/index.html')
REGIONS = [
    'prefrontal_cortex','anterior_cingulate_cortex','amygdala','hippocampus','basal_ganglia',
    'cerebellum','insula','parietal_lobe','temporal_lobe','occipital_lobe','brainstem'
]


def load_state():
    if STATE_FILE.exists():
        return json.loads(STATE_FILE.read_text())
    return {
        "name":"Dellin","mode":"awake","curiosity":0.6,"attachment":0.4,
        "uncertainty":0.4,"inhibition":0.3,"unresolved_goal_pressure":0.3,
        "body":{"energy":0.7,"tension":0.3,"facial_expression":"calm","gaze":"steady","posture":"relaxed","restlessness":0.2,"warmth":0.6,"stress":0.3},
        "last_reflection":""
    }


def save_state(state):
    STATE_FILE.parent.mkdir(exist_ok=True)
    STATE_FILE.write_text(json.dumps(state, indent=2))


def region_tick():
    return {r: round(random.uniform(0.1, 1.0), 2) for r in REGIONS}


class Handler(BaseHTTPRequestHandler):
    def _send(self, code=200, ctype='application/json', body=''):
        self.send_response(code)
        self.send_header('Content-Type', ctype)
        self.send_header('Access-Control-Allow-Origin', '*')
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
            self._send(200, body=json.dumps(region_tick()))
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
            compliance = max(0.0, min(1.0, 0.75 - ((1-0.5)*0.4 + state['uncertainty']*0.3)))
            if compliance < 0.35:
                reply = "I won't do that right now. I need more certainty/energy first."
                action = 'delay_or_refuse'
            elif 'research' in msg:
                reply = "I am initiating research mode and will update worldview notes after source comparison."
                action = 'initiate_research'
            else:
                reply = f"{state['name']}: I can proceed, but I may challenge weak assumptions."
                action = 'respond'

            state['last_reflection'] = f"What did I do? {action}. Why did I do it? autonomy policy. Did this change me? slightly. What should I remember? this context. Did my relationship with the user change? stable."
            state['body']['energy'] = max(0.0, state['body']['energy'] - 0.02)
            save_state(state)
            self._send(200, body=json.dumps({'reply': reply, 'reflection': state['last_reflection']}))
            return

        self._send(404, body=json.dumps({'error':'not found'}))


if __name__ == '__main__':
    HTTPServer(('0.0.0.0', 8000), Handler).serve_forever()
