export function translateStorageError(error: any): string {
  if (!error) return "حدث خطأ غير معروف أثناء الرفع.";
  
  const code = error.code || (error.message && error.message.includes("storage/") ? error.message : "storage/unknown");
  
  if (code.includes("storage/unauthorized") || code.includes("permission-denied")) {
    return "تم رفض الإذن (Permission Denied): قواعد أمان Firebase Storage تمنع الرفع. يرجى تعديل القواعد في لوحة تحكم Firebase للسماح بالرفع.";
  }
  if (code.includes("storage/unauthenticated")) {
    return "غير مصرح (Unauthenticated): يجب تسجيل الدخول أولاً للقيام بهذه العملية.";
  }
  if (code.includes("storage/canceled")) {
    return "تم إلغاء عملية الرفع من قبل المستخدم.";
  }
  if (code.includes("storage/quota-exceeded")) {
    return "تم تجاوز المساحة المتاحة (Quota Exceeded): باقة حسابك تجاوزت الحد المسموح به للرفع اليوم.";
  }
  if (code.includes("storage/retry-limit-exceeded") || code.includes("timeout")) {
    return "انتهت مهلة الاتصال (Network Timeout): فشل الاتصال بخوادم Firebase. يرجى التحقق من جودة اتصال الإنترنت.";
  }
  if (code.includes("storage/bucket-not-found")) {
    return "حاوية التخزين غير موجودة (Storage Bucket Not Found): يرجى التأكد من تفعيل خدمة Storage بالضغط على 'Get Started' في لوحة تحكم Firebase للمشروع rta-bus-handover-01.";
  }
  if (code.includes("storage/project-not-found")) {
    return "مشروع Firebase غير موجود. يرجى التحقق من صحة المعرف Project ID.";
  }
  if (code.includes("storage/invalid-checksum")) {
    return "الملف الذي تحاول رفعه تالف أو حدث خطأ أثناء نقله.";
  }
  if (code.includes("storage/unknown") || code.includes("unknown")) {
    // Check if it's likely a missing bucket / disabled billing issue
    if (error.message && error.message.includes("bucket")) {
      return "حاوية التخزين غير موجودة أو معطلة. يرجى تفعيل Storage في لوحة تحكم Firebase للمشروع rta-bus-handover-01.";
    }
    return "خطأ غير معروف (Storage Unknown): يرجى التأكد من تفعيل خدمة Storage وقواعد الأمان الخاصة بها في حساب Firebase.";
  }

  return error.message || "حدث خطأ غير متوقع أثناء عملية الرفع.";
}
