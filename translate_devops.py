import json
import re
import urllib.request
import urllib.parse
import time
import os
import threading
import concurrent.futures

PROTECTED_TERMS = [
    # Multi-word phrases first
    "docker compose", "docker-compose", "docker build", "docker run", "docker ps",
    "docker images", "docker exec", "docker logs", "docker stop", "docker rm",
    "docker rmi", "docker volume", "docker network", "docker events", "docker inspect",
    "docker cp", "docker attach", "docker restart",
    "reverse proxy", "load balancer", "proxy_pass", "combined Log Format", "%{User-agent}i",
    "git commit", "git push", "git pull", "git branch", "git checkout", "git merge",
    "git rebase", "git status", "git log", "git clone", "git fetch", "git stash",
    "git tag", "git remote", "git reset", "git diff", "git add",
    "user is not in the sudoers file", "sudoers file",
    "systemctl start", "systemctl stop", "systemctl restart", "systemctl status",
    "systemctl enable", "systemctl disable", "systemctl reload",
    "iptables -t nat", "iptables -A", "iptables -F", "iptables -L", "iptables -D",
    "iptables -I", "iptables -R",
    "PREROUTING", "POSTROUTING", "FORWARD", "INPUT", "OUTPUT",
    "Type of service", "Three-way handshake",
    "/usr/local/bin", "/etc/hosts", "/etc/resolv.conf", "/etc/passwd", "/etc/shadow",
    "/etc/group", "/etc/fstab", "/etc/sudoers", "/var/log", "/proc", "/sys", "/dev",
    "/etc/network", "/etc/systemd", "/etc/nginx",
    
    # CLI Tools & Commands
    "Dockerfile", "docker", "iptables", "systemctl", "systemd", "journalctl",
    "crontab", "cron", "top", "htop", "ps", "kill", "pkill", "killall",
    "free", "df", "du", "uname", "chmod", "chown", "chgrp", "umask",
    "grep", "awk", "sed", "cat", "less", "more", "tail", "head", "find", "xargs",
    "tar", "gzip", "bzip2", "xz", "zip", "unzip", "ssh", "scp", "rsync",
    "curl", "wget", "ping", "traceroute", "netstat", "ss", "ifconfig", "route",
    "tcpdump", "wireshark", "nginx", "apache", "git", "bash", "zsh", "sudo", "su",
    "lsof", "strace", "dmesg", "sysctl", "chroot", "cgroups",
    
    # DevOps & Infrastructure Concepts
    "pipeline", "container", "containers", "image", "images", "volume", "volumes",
    "daemon", "socket", "runner", "artifact", "artifacts", "stage", "stages",
    "job", "jobs", "pod", "pods", "k8s", "kubernetes", "service", "ingress",
    "configmap", "secret", "namespace", "namespaces", "deployment", "deployments",
    "daemonset", "statefulset", "replica", "replicaset",
    "inode", "symlink", "hardlink", "NAT", "SNAT", "DNAT", "MASQUERADE",
    "CIDR", "TCP", "UDP", "ICMP", "HTTP", "HTTPS", "DNS", "DHCP", "ARP",
    "SSL", "TLS", "localhost", "loopback", "gateway", "netmask", "subnet",
    "proxy", "upstream",
    
    # Programming & Shell Syntax
    "if", "else", "elif", "fi", "then", "for", "while", "until", "case", "esac",
    "return", "exit", "break", "continue", "function", "null", "NULL", "true", "false",
    "SELECT", "FROM", "WHERE", "JOIN", "GROUP BY", "ORDER BY", "HAVING",
    "$#", "$?", "$@", "$*", "$0", "$1", "$$",
    "stdin", "stdout", "stderr"
]

def mask_text(text):
    if not text:
        return "", {}
    sorted_terms = sorted(PROTECTED_TERMS, key=len, reverse=True)
    mapping = {}
    counter = 0

    # 1. Protect code in backticks
    def replace_backtick(m):
        nonlocal counter
        token = f"TOKENXYZ{counter}END"
        mapping[token] = m.group(0)
        counter += 1
        return token

    masked = re.sub(r'`[^`]+`', replace_backtick, text)

    # 2. Protect IP addresses / CIDR / ports
    def replace_ip(m):
        nonlocal counter
        token = f"TOKENXYZ{counter}END"
        mapping[token] = m.group(0)
        counter += 1
        return token

    masked = re.sub(r'\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}(?:/\d{1,2})?\b', replace_ip, masked)

    # 3. Protect designated terms
    for term in sorted_terms:
        if re.match(r'^[a-zA-Z0-9_\-]+$', term):
            pattern = rf'(?i)\b{re.escape(term)}\b'
        else:
            pattern = re.escape(term)

        def replace_term(m):
            nonlocal counter
            token = f"TOKENXYZ{counter}END"
            mapping[token] = m.group(0)
            counter += 1
            return token

        masked = re.sub(pattern, replace_term, masked)

    return masked, mapping

def unmask_text(text, mapping):
    result = text
    for token, orig in mapping.items():
        pattern = re.escape(token)
        result = re.sub(pattern, orig, result, flags=re.IGNORECASE)
    return result

def clean_uzbek(text):
    subs = [
        (r'\bquvur liniyasi\b', 'pipeline'),
        (r'\bquvur\b', 'pipe'),
        (r'\byuqori buyruq\b', 'top buyrug\'i'),
        (r'\bbepul buyruq\b', 'free buyrug\'i'),
        (r'\bo\'ldirish buyrug\'i\b', 'kill buyrug\'i'),
        (r'\bmezbon\b', 'host'),
        (r'\brozetka\b', 'socket'),
        (r'\bovoz balandligi\b', 'volume'),
        (r'\btarmoq maskasi\b', 'netmask (tarmoq maskasi)'),
    ]
    res = text
    for pat, rep in subs:
        res = re.sub(pat, rep, res, flags=re.IGNORECASE)
    return res

def fetch_translation(text, lang, max_retries=3):
    if not text or not text.strip():
        return text
    
    masked, mapping = mask_text(text)
    url = 'https://translate.googleapis.com/translate_a/single?client=gtx&sl=ru&tl=' + lang + '&dt=t&q=' + urllib.parse.quote(masked)
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    
    for attempt in range(max_retries):
        try:
            with urllib.request.urlopen(req, timeout=12) as resp:
                data = json.loads(resp.read().decode('utf-8'))
                translated = ''.join([part[0] for part in data[0] if part[0]])
                unmasked = unmask_text(translated, mapping)
                if lang == 'uz':
                    unmasked = clean_uzbek(unmasked)
                return unmasked
        except Exception as e:
            if attempt < max_retries - 1:
                time.sleep(0.5 + attempt * 0.5)
            else:
                return unmask_text(masked, mapping)

def process_single_question(q, idx):
    ru_q = q.get("question", "")
    uz_q = fetch_translation(ru_q, "uz")
    en_q = fetch_translation(ru_q, "en")

    raw_answers = q.get("answers", [])
    translated_answers = []

    for a in raw_answers:
        aid = a.get("id", "")
        ru_text = a.get("text", "")
        is_correct = a.get("is_correct", False)

        has_cyrillic = bool(re.search(r'[а-яА-ЯёЁ]', ru_text))
        if not has_cyrillic:
            uz_text = ru_text
            en_text = ru_text
        else:
            prefix_match = re.match(r'^([A-Z]\)\s*|\d+\)\s*|-\s*)', ru_text)
            prefix = prefix_match.group(1) if prefix_match else ""
            core_text = ru_text[len(prefix):]

            uz_core = fetch_translation(core_text, "uz")
            en_core = fetch_translation(core_text, "en")

            uz_text = prefix + uz_core
            en_text = prefix + en_core

        translated_answers.append({
            "id": aid,
            "text": {
                "ru": ru_text,
                "uz": uz_text,
                "en": en_text
            },
            "is_correct": is_correct
        })

    ru_exp = q.get("explanation", "")
    if ru_exp:
        uz_exp = fetch_translation(ru_exp, "uz")
        en_exp = fetch_translation(ru_exp, "en")
    else:
        uz_exp = ""
        en_exp = ""

    return {
        "id": q.get("id", idx),
        "type": q.get("type", "radio"),
        "question": {
            "ru": ru_q,
            "uz": uz_q,
            "en": en_q
        },
        "answers": translated_answers,
        "explanation": {
            "ru": ru_exp,
            "uz": uz_exp,
            "en": en_exp
        }
    }

def translate_devops_dataset():
    src_path = "/home/laziz/devops/src/data/devops.json"
    cache_path = "/home/laziz/devops/devops_translated_cache.json"

    with open(src_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    questions = data.get("questions", [])
    total = len(questions)
    print(f"Total DevOps questions: {total}", flush=True)

    cache = {}
    if os.path.exists(cache_path):
        try:
            with open(cache_path, "r", encoding="utf-8") as f:
                cache = json.load(f)
            print(f"Loaded {len(cache)} cached questions.", flush=True)
        except Exception as e:
            print(f"Cache load error: {e}", flush=True)

    lock = threading.Lock()
    completed_count = len(cache)

    def worker(q, idx):
        nonlocal completed_count
        qid = str(q.get("id", idx))
        if qid in cache:
            return qid, cache[qid]

        res = process_single_question(q, idx)
        with lock:
            cache[qid] = res
            completed_count += 1
            if completed_count % 5 == 0 or completed_count == total:
                with open(cache_path, "w", encoding="utf-8") as f:
                    json.dump(cache, f, ensure_ascii=False, indent=2)
                print(f"Progress: {completed_count}/{total} questions completed.", flush=True)
        return qid, res

    # Run with 8 worker threads
    with concurrent.futures.ThreadPoolExecutor(max_workers=8) as executor:
        futures = [executor.submit(worker, q, idx) for idx, q in enumerate(questions)]
        concurrent.futures.wait(futures)

    # Save final cache
    with open(cache_path, "w", encoding="utf-8") as f:
        json.dump(cache, f, ensure_ascii=False, indent=2)

    # Assemble questions in exact original order
    ordered_translated = []
    for idx, q in enumerate(questions):
        qid = str(q.get("id", idx))
        ordered_translated.append(cache.get(qid))

    out_obj = {
        "source": "https://widum.ru/s21/devops/",
        "title": "Школа 21. Экзамен DevOps (Теория)",
        "total_questions": len(ordered_translated),
        "questions": ordered_translated
    }

    for p in ["/home/laziz/devops/devops_exam_questions.json", "/home/laziz/devops/src/data/devops.json"]:
        with open(p, "w", encoding="utf-8") as f:
            json.dump(out_obj, f, ensure_ascii=False, indent=2)
        print(f"Successfully saved {len(ordered_translated)} questions to {p}", flush=True)

if __name__ == "__main__":
    translate_devops_dataset()
