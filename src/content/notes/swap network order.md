---
tags: 
  - cs
created: 2025-07-01 13:31
edited: 2025-07-01 13:31
---
At work, I had a situation where I had to switch between WIFI and ethernet on my mac. 
To do this, I created a script to change the network order in my mac.
`networksetup --listnetworkserviceorder, --ordernetworkservices `were used.
`--ordernetworkservices` needs the names of all active network services in order separated by whitespace. If the service name had a whitespace, the entire name must be enclosed in quotation marks.

At first I hardcoded the network order list
```
"Wi-Fi"
"USB 10/100/1000 LAN"
"Thunderbolt Bridge"
"iPhone USB"
```
And created two variables in a bash script named `ORDER_WIFI_FIRST`, and `ORDER_LAN_FIRST`
However, the first problem I faced was when I shared the script with a coworker. If the coworker had another network connected, or if the name of the networks are different than mine, they would have to manually change the content of the script.

First try: (hardcoded values)
```
#!/bin/bash

# Get the network service order
# networksetup -listnetworkserviceorder | grep -E '\([0-9]+\)' | sed -E 's/^\([0-9]+\) //'

# Get the first network service in the order
FIRST_SERVICE=$(networksetup -listnetworkserviceorder | grep "(1)"  | awk '{print $2}')

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

Second try: (dynamically create the network services array)
```
#!/bin/bash

# Get the current list of network services in order
SERVICES=()
while IFS= read -r line; do
  SERVICES+=("$line")
done < <(networksetup -listnetworkserviceorder | grep -E '\([0-9]+\)' | sed -E 's/^\([0-9]+\) //')

FIRST_SERVICE="${SERVICES[0]}"
SECOND_SERVICE="${SERVICES[1]}"
echo "SERVICES: '${SERVICES[@]}'"

# Swap the first two services
SWAPPED_SERVICES=("${SERVICES[@]}")
SWAPPED_SERVICES[0]="$SECOND_SERVICE"
SWAPPED_SERVICES[1]="$FIRST_SERVICE"

echo "Switching order: $FIRST_SERVICE <-> $SECOND_SERVICE"
networksetup -ordernetworkservices "${SWAPPED_SERVICES[@]}"
echo "✅ Swapped the top two network services."

```

The result is much more robust as the exact name of the service does not matter. 
The only thing to make sure is to keep the wifi and ethernet service as the top two 