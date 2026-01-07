---
tags: 
  - cs
created: 2025-06-24 09:48
edited: 2025-06-24 09:48
---
```bash
#!/bin/bash

# Get the first network service in the order
FIRST_SERVICE=$(networksetup -listnetworkserviceorder | grep "(1)" | awk '{print $2}')

# Define your two orders
ORDER_WIFI_FIRST=(
	"Wi-Fi"
	"USB 10/100/1000 LAN"
	"Thunderbolt Bridge"
	"iPhone USB"
)

ORDER_LAN_FIRST=(
	"USB 10/100/1000 LAN"
	"Wi-Fi"
	"Thunderbolt Bridge"
	"iPhone USB"
)

echo "FIRST_SERVICE: '$FIRST_SERVICE'"
  
if [[ "$FIRST_SERVICE" == "Wi-Fi" ]]; then
	echo "Wi-Fi is first. Switching to LAN first..."
	networksetup -ordernetworkservices "${ORDER_LAN_FIRST[@]}"
	echo "✅ LAN is now first."
else
	echo "LAN is first. Switching to Wi-Fi first..."
	networksetup -ordernetworkservices "${ORDER_WIFI_FIRST[@]}"
	echo "✅ Wi-Fi is now first."
fi
```
