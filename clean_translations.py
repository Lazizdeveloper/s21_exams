import json
import re

def refine_uzbek_text(text):
    if not text:
        return text
    
    # 1. Fix "qo'ng'iroq" in technical contexts
    text = re.sub(r'cronga har 4 soatda qanday qo\'ng\'iroq qilish mumkin\?', 
                  'cron yordamida har 4 soatda vazifani qanday ishga tushirish mumkin?', text, flags=re.IGNORECASE)
    text = re.sub(r'df ga qo\'ng\'iroq qilishda qanday kalit ishlatiladi', 
                  'df buyrug\'ini ishlatishda qaysi parametr (flag) ishlatiladi', text, flags=re.IGNORECASE)
    text = re.sub(r'sudo / su ga qo\'ng\'iroq qilish orqali', 
                  'sudo / su buyrug\'ini chaqirish (ishlatish) orqali', text, flags=re.IGNORECASE)
    text = re.sub(r'sudo / su raqamlariga qo\'ng\'iroq qilishingiz mumkin', 
                  'sudo / su buyrug\'ini chaqirish orqali amalga oshirish mumkin', text, flags=re.IGNORECASE)
    text = re.sub(r'su yoki sudoga qo\'ng\'iroq qilish orqali', 
                  'su yoki sudo buyrug\'ini chaqirish orqali', text, flags=re.IGNORECASE)
    text = re.sub(r'RUN qo\'ng\'iroqlarining minimal soni', 
                  'RUN buyruqlarining minimal soni', text, flags=re.IGNORECASE)
    text = re.sub(r'RUN qo\'ng\'iroqlari', 
                  'RUN buyruqlari', text, flags=re.IGNORECASE)
    text = re.sub(r'qo\'ng\'iroq qilish orqali', 
                  'chaqirish (ishga tushirish) orqali', text, flags=re.IGNORECASE)
    text = re.sub(r'qo\'ng\'iroq qilishda', 
                  'chaqirishda (ishlatishda)', text, flags=re.IGNORECASE)
    text = re.sub(r'qo\'ng\'iroq qilish', 
                  'chaqirish (ishga tushirish)', text, flags=re.IGNORECASE)

    # 2. Fix "Sensorli" for touch command
    text = re.sub(r'Sensorli buyruqda -c tugmasi yo\'q', 'touch buyrug\'ida -c parametri (flag) yo\'q', text, flags=re.IGNORECASE)
    text = re.sub(r'Sensorli buyruq', 'touch buyrug\'i', text, flags=re.IGNORECASE)

    # 3. Fix "ildiz" for root user / root directory
    text = re.sub(r'^Ildiz nima\?$', 'root (superfoydalanuvchi) nima?', text)
    text = re.sub(r'ildizdan qanday chaqirish mumkin\?', 'root foydalanuvchisi ostida qanday ishga tushirish mumkin?', text, flags=re.IGNORECASE)
    text = re.sub(r'ildiz foydalanuvchi katalogi', 'root foydalanuvchisi katalogi (/root)', text, flags=re.IGNORECASE)
    text = re.sub(r'fayl tizimining ildizi', 'fayl tizimi ildizi (root directory /)', text, flags=re.IGNORECASE)
    text = re.sub(r'tizim ildiz papkasi', 'tizimning ildiz (root /) papkasi', text, flags=re.IGNORECASE)
    text = re.sub(r'O\'rnatish vaqtida ildiz qo\'shish kerak', 'O\'rnatish vaqtida root foydalanuvchisini qo\'shish kerak', text, flags=re.IGNORECASE)

    # 4. Fix Docker "rasm" / "tasvir" to "image (obraz)"
    text = re.sub(r'Docker tasvirini', 'Docker image\'ni', text, flags=re.IGNORECASE)
    text = re.sub(r'Docker tasvirlari', 'Docker image\'lari', text, flags=re.IGNORECASE)
    text = re.sub(r'Konteyner tasviri', 'Container image (obraz)', text, flags=re.IGNORECASE)
    text = re.sub(r'konteyner tasviri', 'container image\'i', text, flags=re.IGNORECASE)
    text = re.sub(r'asosiy tasvirni o\'rnatadi', 'asosiy (base) image\'ni belgilaydi', text, flags=re.IGNORECASE)
    text = re.sub(r'Rasmdagi qatlamlarning ahamiyati nimada\?', 'Docker image qatlamlarining (layers) ahamiyati nimada?', text, flags=re.IGNORECASE)
    text = re.sub(r'Rasm qatlamlarining maqsadi nima\?', 'Docker image qatlamlarining (layers) vazifasi nima?', text, flags=re.IGNORECASE)
    text = re.sub(r'^Tasvir nima\?$', 'Docker image (obraz) nima?', text)
    text = re.sub(r'Barcha rasmlar ro\'yxatini qanday olish mumkin\?', 'Barcha Docker image\'lar ro\'yxatini qanday olish mumkin?', text, flags=re.IGNORECASE)
    text = re.sub(r'Rasmni qanday yuklab olish mumkin\?', 'Docker image\'ni qanday yuklab olish (pull) mumkin?', text, flags=re.IGNORECASE)
    text = re.sub(r'Rasmni qanday yuklash kerak\?', 'Docker image\'ni qanday yuklash (push / save) kerak?', text, flags=re.IGNORECASE)
    text = re.sub(r'rasm ichidagi faylni', 'image ichidagi faylni', text, flags=re.IGNORECASE)
    text = re.sub(r'Tasvir qatlamini qanday buyruq yaratish mumkin\?', 'Image qatlamini qaysi buyruq yaratadi?', text, flags=re.IGNORECASE)
    text = re.sub(r'Tasvir hajmini', 'Image hajmini', text, flags=re.IGNORECASE)
    text = re.sub(r'tasvirlarni saqlash', 'image\'larni saqlash', text, flags=re.IGNORECASE)
    text = re.sub(r'Nima uchun rasmda RUN', 'Nima uchun Docker image ichida RUN', text, flags=re.IGNORECASE)
    text = re.sub(r'Nega rasmdagi RUN', 'Nega Docker image ichidagi RUN', text, flags=re.IGNORECASE)
    text = re.sub(r'gitlab-ci\.yml da tasvirni qanday belgilashim mumkin\?', 'gitlab-ci.yml da qaysi Docker image ishlatilishini qanday ko\'rsatish mumkin?', text, flags=re.IGNORECASE)
    text = re.sub(r'GitLab-da sahnani bajarishda ishlatiladigan tasvirni qanday aniqlash mumkin\?', 'GitLab-da bosqichni bajarishda ishlatiladigan image\'ni qanday ko\'rsatish mumkin?', text, flags=re.IGNORECASE)

    # 5. Fix CLI "tugma" for flag/option
    text = re.sub(r'-l tugmasi ls buyrug\'i uchun nima qiladi\?', '-l parametri (flag) ls buyrug\'ida nima vazifani bajaradi?', text, flags=re.IGNORECASE)
    text = re.sub(r'df buyrug‘ini qaysi tugma yordamida bajarish kerak\?', 'df buyrug\'ida ma\'lumotlarni odam o\'qiy oladigan ko\'rinishda (human-readable) chiqarish uchun qaysi parametr (flag) ishlatiladi?', text, flags=re.IGNORECASE)

    # 6. Fix specific mangled questions
    text = re.sub(r'`ы бывают у gitlab-runner`a qanday ijrochi\?', 'gitlab-runner\'da qanday executor (ijrochi) turlari mavjud?', text)
    text = re.sub(r'nginx asosiy mavzu nima uchun javob beradi\?', 'nginx\'ning asosiy oqimi (master process / main thread) nima uchun javob beradi?', text)

    return text

# Apply to devops.json
with open('/home/laziz/devops/src/data/devops.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

changed = 0
for q in data['questions']:
    orig_q = q['question']['uz']
    new_q = refine_uzbek_text(orig_q)
    if orig_q != new_q:
        q['question']['uz'] = new_q
        changed += 1
        
    for a in q.get('answers', []):
        orig_a = a['text']['uz']
        new_a = refine_uzbek_text(orig_a)
        if orig_a != new_a:
            a['text']['uz'] = new_a
            changed += 1
            
    orig_exp = q.get('explanation', {}).get('uz', '')
    new_exp = refine_uzbek_text(orig_exp)
    if orig_exp != new_exp:
        q['explanation']['uz'] = new_exp
        changed += 1

print(f"Total refined items: {changed}")

for p in ['/home/laziz/devops/src/data/devops.json', '/home/laziz/devops/devops_exam_questions.json']:
    with open(p, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"Updated {p}")
