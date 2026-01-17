import sys
import requests

filename = input("filename=")

# The first will handle the logs. (a)
# The second will handle all user-related tasks. (b)
# The third will handle all cost-related tasks. (c)
# The fourth will handle any admin-related tasks (e.g. developers details) (d)

a = "https://logs-service-qa7i.onrender.com"
b = "https://users-service-tiv3.onrender.com"
c = "https://costs-service-nyve.onrender.com"
d = "https://admin-service-7rrv.onrender.com"

# Redirect all prints to a file
output = open(filename, "w", encoding="utf-8")
sys.stdout = output

print("a=" + a)
print("b=" + b)
print("c=" + c)
print("d=" + d)
print()

print("testing getting the about")
print("-------------------------")

try:
    url = d + "/api/about/"
    data = requests.get(url)

    print("url=" + url)
    print("data.status_code=" + str(data.status_code))
    print("data.content=" + str(data.content))
    print("data.text=" + data.text)

    # if response isn't JSON, this may throw -> handled by except
    print("data.json()=" + str(data.json()))

except Exception as e:
    print("problem")
    print(e)

print()
print("testing getting the report - 1")
print("------------------------------")

try:
    url = c + "/api/report/?id=123123&year=2026&month=1"
    data = requests.get(url)

    print("url=" + url)
    print("data.status_code=" + str(data.status_code))
    print("data.content=" + str(data.content))
    print("data.text=" + data.text)

except Exception as e:
    print("problem")
    print(e)

print()
print("testing adding cost item")
print("----------------------------------")

try:
    url = c + "/api/add/"
    data = requests.post(
        url,
        json={"userid": 123123, "description": "milk 9", "category": "food", "sum": 8}
    )

    print("url=" + url)
    print("data.status_code=" + str(data.status_code))
    print("data.content=" + str(data.content))
    print("data.text=" + data.text)

except Exception as e:
    print("problem")
    print(e)

print()
print("testing getting the report - 2")
print("------------------------------")

try:
    url = c + "/api/report/?id=123123&year=2026&month=1"
    data = requests.get(url)

    print("url=" + url)
    print("data.status_code=" + str(data.status_code))
    print("data.content=" + str(data.content))
    print("data.text=" + data.text)

except Exception as e:
    print("problem")
    print(e)

# Close the file and restore stdout (nice cleanup)
output.close()
sys.stdout = sys.__stdout__
print(f"Done. Output written to {filename}")
