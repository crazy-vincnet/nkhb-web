/**
 * NKHB 희망의 편지 - Google Apps Script
 *
 * 사용 방법:
 * 1. https://script.google.com 접속
 * 2. 새 프로젝트 생성 후 이 코드를 붙여넣기
 * 3. SHEET_ID 와 NOTIFY_EMAIL 값을 본인 환경에 맞게 수정
 * 4. 배포 → 새 배포 → 유형: 웹 앱
 *    - 실행 권한: 나
 *    - 액세스 권한: 모든 사용자
 * 5. 생성된 웹 앱 URL을 script.js 의 scriptURL 에 붙여넣기
 */

// ===== 설정 =====
const SHEET_ID = '여기에_구글시트_ID_입력';        // 시트 URL의 /d/ 와 /edit 사이 문자열
const SHEET_NAME = '희망의편지';                   // 데이터를 저장할 시트 탭 이름
const NOTIFY_EMAIL = 'nkhb316@gmail.com';        // 알림을 받을 이메일 주소
const SEND_AUTO_REPLY = true;                    // 작성자에게 자동 회신 보낼지 여부

// ===== 폼 데이터 수신 =====
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const timestamp = new Date();

    saveToSheet(data, timestamp);
    sendNotificationEmail(data, timestamp);

    if (SEND_AUTO_REPLY && data.email) {
      sendAutoReplyEmail(data);
    }

    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    console.error('doPost error:', err);
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ===== 시트에 저장 =====
function saveToSheet(data, timestamp) {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  let sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow([
      '작성일시', '이름', '거주 지역', '이메일', '관심 계기', '희망의 메시지'
    ]);
  }

  sheet.appendRow([
    timestamp,
    data.name || '익명',
    data.location || '',
    data.email || '',
    data.reason || '',
    data.message || ''
  ]);
}

// ===== NKHB에 알림 메일 발송 =====
function sendNotificationEmail(data, timestamp) {
  const subject = `[희망의 편지] ${data.name || '익명'}님이 보낸 편지`;

  const body =
    '※ NKHB 웹사이트의 희망의 편지 폼을 통해 새 편지가 도착했습니다.\n\n' +
    '─────────────────────\n' +
    `작성일시: ${Utilities.formatDate(timestamp, 'Asia/Seoul', 'yyyy-MM-dd HH:mm:ss')}\n` +
    `이름: ${data.name || '익명'}\n` +
    `거주 지역: ${data.location || '-'}\n` +
    `이메일: ${data.email || '-'}\n` +
    `북한에 관심을 갖게 된 계기: ${data.reason || '-'}\n` +
    '─────────────────────\n\n' +
    '희망의 메시지:\n' +
    '─────────────────────\n' +
    (data.message || '') + '\n' +
    '─────────────────────';

  MailApp.sendEmail({
    to: NOTIFY_EMAIL,
    subject: subject,
    body: body,
    replyTo: data.email || NOTIFY_EMAIL,
    name: 'NKHB 희망의 편지'
  });
}

// ===== 작성자에게 자동 회신 (선택) =====
function sendAutoReplyEmail(data) {
  const subject = '[NKHB] 희망의 편지를 받았습니다';

  const body =
    `${data.name || '익명'}님, 안녕하세요.\n\n` +
    '뉴코리아 희망방송(NKHB)에 희망의 편지를 보내주셔서 진심으로 감사드립니다.\n' +
    '보내주신 따뜻한 메시지는 한국어로 번역되어 탈북민의 목소리로 북한 전역에 방송될 예정입니다.\n\n' +
    '─────────────────────\n' +
    '보내주신 메시지:\n' +
    '─────────────────────\n' +
    (data.message || '') + '\n' +
    '─────────────────────\n\n' +
    '북한 주민들이 생각날 때마다 계속해서 메시지를 보내주시면 더욱 감사하겠습니다.\n\n' +
    '뉴코리아 희망방송(NKHB) 드림\n' +
    'nkhb316@gmail.com';

  MailApp.sendEmail({
    to: data.email,
    subject: subject,
    body: body,
    name: '뉴코리아 희망방송 (NKHB)'
  });
}

// ===== 테스트용 함수 (스크립트 편집기에서 직접 실행) =====
function testSubmit() {
  const mockData = {
    name: '홍길동',
    location: '서울',
    email: 'test@example.com',
    reason: '테스트',
    message: '북한 주민 여러분께 희망과 사랑을 전합니다.'
  };
  saveToSheet(mockData, new Date());
  sendNotificationEmail(mockData, new Date());
  console.log('테스트 완료 — 시트와 메일을 확인하세요.');
}
