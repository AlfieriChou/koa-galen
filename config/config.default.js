module.exports = {
  jwt: {
    privateKey: Buffer.from('LS0tLS1CRUdJTiBSU0EgUFJJVkFURSBLRVktLS0tLQpNSUlFcEFJQkFBS0NBUUVBb3Z0TzRoRU11d0VpeloxL0ljenJSbjBUaG85NXphMlM4NloxdXRiZklwekhsWVFKCko2bGlCUUNPdTh2Rkplb1p2UUtjUlQvVXp2ZkFhVDdhT0paS1pTSmZ1SkJwU2ZrNFhDSmlsRUZwUEFnZnBwbncKeFd4V2t0US9YTzZwSVB6NFBxdytjRjlHN2RyUmx5QnNsRko0V0tWdEkra0VPVlg0Z1RQdUgvckFqbHBvc2lxYwpjSWh2aHBjVG5GQUEvWkY5OTU3VjYzMTdpUTBFcWdJcnM3ckFFNGhiSXlNZGlzNlJRcExmOU1lRW5JOUhDalVOCkdJYmlLYWtlREtrR2MzN0tzb0xNcktlUVlzdkFLS0FxV1FUaTl6ZS9XMS9MSkZkK1d6OFRTZDNmK2x2WCt3aTkKTGJpcDB5ZmtGK1V5eW42SEgzdzVuc0l5ZWJmeVJ4blhUa3FDZ1FJREFRQUJBb0lCQUFJV0k0bGpYSDFjWTF5cwpnbjhsUjNITWtoNXI0Y3hQUjQxVStUYmVIMWNyR0tjQ1hMZWtSSHY1Nk5uZ252S0FUN29LdVlOdGNNVUJpUFlQCjl1MDRoMVZLSGwyWGc3R052am4zdXJsWktRYTZ0K1VESFlENWhSWTJIMldLTEtJZWV2TWFjMll1NGhLVGRaRncKdWRNZ1J5Z2pYZ1ZTcTFvc2pwVGczRkNPZmo2VVJuMHBlV0pXVmhFT3d3TDJSL2xPMDlCWXVwUjRRWm4wRUkvUQpNWXBXSlc4UWxFVS9PS3Awd1F4Z2tKQzhIWnEzcTh1QVFRS0xkcVlVYnFaNTlhWFZFemZxSml2T1l4dFVTTHdhClg4emxFUUZuOHFaUXNXNUcyZGpZZXZwVXY1YjU4Y3NXTmdLOFJJWmhMaHJNWGdBd3RoSFNzRmdBZ1o5Y1J6VGsKT295Wm1RRUNnWUVBMDN3TkdnYjNuWmdHVVRVRkdaMnhuczF4QS9tRkFSWTRpWW1FcFViTzYreXc1SXJKbllkNQo4Q2JmYjJMc1hvcUE2ZGhvWHVEK1YrZWVqbGltMjc5bDJ6dTA4bytOOURPQ09NU3Nlb25HTm4wTG1QT2owVmRyClhWM2xyQVo1V0NZZVVyOWVZYndZcEVQUGxQcnlzcWFmWUFDd213cnh1d01QdEc3Q3lOY2pKREVDZ1lFQXhVbW4Ka0lGelo2RFBtQk5MT241eW1Zc0xEdWpkNlNVZi9xeFA5QnZhZ2JRY1VicGZvUkNnd2JkdXpkaStEdTZUMmo1TApkT294TnhraE9STlRtT3JNbzMyMXVKQkVXcXRhbUtvWThRWTFQc3NMZkJDclJYc1FHSW5wZWU3MDRRSjAwWUU3CmtTbUgxbCtId3NNWXM5ZGZoL3l4OENQaER0aWg5MDgwdjMyRVAxRUNnWUJUcEh5S0RyZGdYUUFpbmhXbVMvZzAKRm96Y1JaT1ZHblRCOE9IRmZIdmFVNEtpNFVGY1RIaXR3ckljRzhQZ29HYmNGZnN4aTBzTStVNThmaE9BVmZLegpBcXBPUlBpZjNMOWtOR1VERWZxVEVtSEQzSml0OHlWRGlCK09LZ0ZVRzc5aWVzMlpXZ3RrN0d6dFAxTTkxU2l6Cmo1Skp2OHBiYkpxSmdrVUhxZzc4QVFLQmdRQ0RsQTBTbnBPV2NMVWppdktvYjM4RkVxdnNaTGpqN3VPNDJibDEKYUVKQ01ScVdFNFFHQ3UzOFpOZWNxRXFSOE9KaE14em1PKzlZL1FTZ2FWaGU2M0pTTTl4SDNNZ0o1TERHa3VPUgpsSDljZ3RVRkNLVUI4UUthS3hpeFB3TEpNdmN3WjAyUUVpL0xkT2s1cHg3Sml3SG0wMHpsaVRobnkybXlaSHdjCm5wemVFUUtCZ1FDekFBclMxYUNUamkyNWJRY0RZMU9wMVM3QVZ0T3BERkxIL2lUaDhpSUJ5bEo3YU51b0xiaG0KeDR4aDlVcmc3UVh5OXNwRzBRUmc4UGtHc2FtdFYrRlpSZmtCUjhQY01UOE5CTVg5bm9pYmZxRUZEK29saFU0ZwpzVmxINTBLRUc1TUFvN0NLR1NQem5MbWgxMmNmRmtFVTNUemFYZGhWaDRVTDBBRmh4dzQxd2c9PQotLS0tLUVORCBSU0EgUFJJVkFURSBLRVktLS0tLQo=', 'base64'),
    publicKey: Buffer.from('LS0tLS1CRUdJTiBQVUJMSUMgS0VZLS0tLS0KTUlJQklqQU5CZ2txaGtpRzl3MEJBUUVGQUFPQ0FROEFNSUlCQ2dLQ0FRRUFvdnRPNGhFTXV3RWl6WjEvSWN6cgpSbjBUaG85NXphMlM4NloxdXRiZklwekhsWVFKSjZsaUJRQ091OHZGSmVvWnZRS2NSVC9VenZmQWFUN2FPSlpLClpTSmZ1SkJwU2ZrNFhDSmlsRUZwUEFnZnBwbnd4V3hXa3RRL1hPNnBJUHo0UHF3K2NGOUc3ZHJSbHlCc2xGSjQKV0tWdEkra0VPVlg0Z1RQdUgvckFqbHBvc2lxY2NJaHZocGNUbkZBQS9aRjk5NTdWNjMxN2lRMEVxZ0lyczdyQQpFNGhiSXlNZGlzNlJRcExmOU1lRW5JOUhDalVOR0liaUtha2VES2tHYzM3S3NvTE1yS2VRWXN2QUtLQXFXUVRpCjl6ZS9XMS9MSkZkK1d6OFRTZDNmK2x2WCt3aTlMYmlwMHlma0YrVXl5bjZISDN3NW5zSXllYmZ5UnhuWFRrcUMKZ1FJREFRQUIKLS0tLS1FTkQgUFVCTElDIEtFWS0tLS0tCg==', 'base64')
  },
  mysql: {
    host: '127.0.0.1',
    user: 'root',
    password: '123456',
    database: 'test'
  },
  port: process.env.PORT || 7000
}
