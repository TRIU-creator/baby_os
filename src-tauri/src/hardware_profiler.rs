use sysinfo::System;

pub fn detect_mode() -> String {
    let mut sys = System::new_all();
    sys.refresh_memory();
    let total_mb = sys.total_memory() / 1024;
    if total_mb <= 2048 {
        "ULTRA_LIGHT_MODE (<150MB Allocated)".to_string()
    } else {
        "GPU_ACCELERATED_MODE".to_string()
    }
}
