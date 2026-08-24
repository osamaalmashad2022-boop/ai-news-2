---
title: "FreeToken: محرك جديد لتشغيل نماذج MoE الضخمة على بطاقة رسوميات واحدة"
summary: "تم الكشف عن محرك FreeToken المخصص لخدمة وتغدية النماذج اللغوية الضخمة على الأجهزة الطرفية، حيث يتيح تشغيل نموذج GLM-5.2 بـ 753 مليار معلمة على محطة عمل تحتوي على بطاقة رسوميات واحدة."
category: "البرمجة"
tags: ["FreeToken","MoE","GLM-5.2","تشغيل محلي","نماذج لغوية"]
sourceName: "MarkTechPost"
sourceUrl: "https://www.marktechpost.com/2026/08/23/meet-freetoken-an-edge-native-moe-serving-engine-that-runs-753b-glm-5-2-on-a-single-workstation-gpu/"
publishedAt: "2026-08-23T10:44:59.000Z"
importance: 4
toolsMentioned: ["FreeToken"]
---

### آلية العمل والابتكار
* **توزيع الحمل:** يعتمد **FreeToken** على تقسيم أخطاء التخزين المؤقت (Cache Misses) لشبكات خبراء التوزيع (MoE) بين حافلة PCIe والكمبيوتر المباشر باستخدام النطاق الترددي المقاس.
* **الميزة التنافسية:** يُمكن التطوير الباحثين والمطورين من تشغيل أحدث النماذج المفتوحة المصدر الضخمة محلياً دون الحاجة لمجموعات خوادم فائقة التكلفة.
