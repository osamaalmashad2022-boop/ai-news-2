---
title: "جوجل تبتكر DiffusionGemma لتوليد النصوص بتقنية الانتشار وسرعة 1500 رمز بالثانية"
summary: "نجح فريق جوجل ديب مايند في تحويل نموذج Gemma 4 إلى نموذج انتشار نصي (Diffusion Model) باستخدام أقل من 10% من ميزانية التدريب الأصلية. يولد النموذج الجديد 256 رمزا بالتوازي بدلاً من رمزا تلو الآخر."
category: "نماذج لغوية"
tags: ["DiffusionGemma","Google DeepMind","نماذج لغوية","Diffusion Model"]
sourceName: "The Decoder"
sourceUrl: "https://the-decoder.com/googles-diffusiongemma-proves-you-dont-need-to-train-from-scratch-to-build-a-text-diffusion-model/"
publishedAt: "2026-08-09T10:01:26.000Z"
importance: 4
toolsMentioned: ["DiffusionGemma"]
---

### ابتكار معمارية جديدة في توليد النصوص

قدمت **Google DeepMind** تجربة جديدة تثبت عدم الحاجة للتدريب من الصفر لبناء نماذج انتشار نصية:

* **التوليد بالتوازي:** يعتمد **DiffusionGemma** على توليد **256 رمزا في وقت واحد** ليصل إلى سرعة **1,500 رمز في الثانية**.
* **كفاءة التدريب:** تمت العملية باستغلال أقل من **10%** من الميزانية المخصصة للتدريب الأصلي لنموذج Gemma 4.
* **التحديات:** لا تزال جودة الاستدلال المنطقي للنموذج متأخرة قليلاً عن النماذج التراجعياً (Autoregressive).
