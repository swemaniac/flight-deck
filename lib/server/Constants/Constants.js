var Constants = {
    ACARS_UNKNOWN:              -1,
    ACARS_XACARS:               3,
    ACARS_XACARS_MSFS:          4,

    FLIGHTSTATUS_BOARDING:      1,
    FLIGHTSTATUS_TAXIOUT:       2,
    FLIGHTSTATUS_DEPARTURE:     3,
    FLIGHTSTATUS_CLIMB:         4,
    FLIGHTSTATUS_CRUISE:        5,
    FLIGHTSTATUS_DESC:          6,
    FLIGHTSTATUS_APPROACH:      7,
    FLIGHTSTATUS_LANDED:        8,
    FLIGHTSTATUS_TAXIIN:        9,
    FLIGHTSTATUS_IN:            10,
    FLIGHTSTATUS_END:           10,
    FLIGHTSTATUS_UNKNOWN:       0,
    FLIGHTSTATUS_CRASH:         99,

    VSPEED_CRZ:                 0,
    VSPEED_GND:                 0,  
    VSPEED_CLB:                 +1,
    VSPEED_DES:                 -1,
};

module.exports = Constants;