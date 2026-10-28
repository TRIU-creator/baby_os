mod hardware_profiler;

#[tauri::command]
fn hardware_mode() -> String {
    hardware_profiler::detect_mode()
}

#[tauri::command]
fn trigger_alarm() -> String {
    "ALARM_TRIGGERED".to_string()
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![hardware_mode, trigger_alarm])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
