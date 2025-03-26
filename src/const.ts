export enum QRMode {
    MODE_NUMBER = 1 << 0,
    MODE_ALPHA_NUM = 1 << 1,
    MODE_8BIT_BYTE = 1 << 2,
    MODE_KANJI = 1 << 3
}

export enum QRMaskPattern {
    PATTERN000 = 0,
    PATTERN001 = 1,
    PATTERN010 = 2,
    PATTERN011 = 3,
    PATTERN100 = 4,
    PATTERN101 = 5,
    PATTERN110 = 6,
    PATTERN111 = 7
}

export const QRCodeLimitLength = [
    [17, 14, 11, 7],
    [32, 26, 20, 14],
    [53, 42, 32, 24],
    [78, 62, 46, 34],
    [106, 84, 60, 44],
    [134, 106, 74, 58],
    [154, 122, 86, 64],
    [192, 152, 108, 84],
    [230, 180, 130, 98],
    [271, 213, 151, 119],
    [321, 251, 177, 137],
    [367, 287, 203, 155],
    [425, 331, 241, 177],
    [458, 362, 258, 194],
    [520, 412, 292, 220],
    [586, 450, 322, 250],
    [644, 504, 364, 280],
    [718, 560, 394, 310],
    [792, 624, 442, 338],
    [858, 666, 482, 382],
    [929, 711, 509, 403],
    [1003, 779, 565, 439],
    [1091, 857, 611, 461],
    [1171, 911, 661, 511],
    [1273, 997, 715, 535],
    [1367, 1059, 751, 593],
    [1465, 1125, 805, 625],
    [1528, 1190, 868, 658],
    [1628, 1264, 908, 698],
    [1732, 1370, 982, 742],
    [1840, 1452, 1030, 790],
    [1952, 1538, 1112, 842],
    [2068, 1628, 1168, 898],
    [2188, 1722, 1228, 958],
    [2303, 1809, 1283, 983],
    [2431, 1911, 1351, 1051],
    [2563, 1989, 1423, 1093],
    [2699, 2099, 1499, 1139],
    [2809, 2213, 1579, 1219],
    [2953, 2331, 1663, 1273]];

export const PATTERN_POSITION_TABLE = [
    [], [6, 18], [6, 22], [6, 26], [6, 30], [6, 34], [6, 22, 38], [6, 24, 42], [6, 26, 46], [6, 28, 50], [6, 30, 54], [6, 32, 58],
    [6, 34, 62], [6, 26, 46, 66], [6, 26, 48, 70], [6, 26, 50, 74], [6, 30, 54, 78], [6, 30, 56, 82], [6, 30, 58, 86], [6, 34, 62, 90],
    [6, 28, 50, 72, 94], [6, 26, 50, 74, 98], [6, 30, 54, 78, 102], [6, 28, 54, 80, 106], [6, 32, 58, 84, 110], [6, 30, 58, 86, 114],
    [6, 34, 62, 90, 118], [6, 26, 50, 74, 98, 122], [6, 30, 54, 78, 102, 126], [6, 26, 52, 78, 104, 130], [6, 30, 56, 82, 108, 134],
    [6, 34, 60, 86, 112, 138], [6, 30, 58, 86, 114, 142], [6, 34, 62, 90, 118, 146], [6, 30, 54, 78, 102, 126, 150], [6, 24, 50, 76, 102, 128, 154],
    [6, 28, 54, 80, 106, 132, 158], [6, 32, 58, 84, 110, 136, 162], [6, 26, 54, 82, 110, 138, 166], [6, 30, 58, 86, 114, 142, 170]
]

export const G15 = (1 << 10) | (1 << 8) | (1 << 5) | (1 << 4) | (1 << 2) | (1 << 1) | (1 << 0)

export const G18 = (1 << 12) | (1 << 11) | (1 << 10) | (1 << 9) | (1 << 8) | (1 << 5) | (1 << 2) | (1 << 0)

export const G15_MASK = (1 << 14) | (1 << 12) | (1 << 10) | (1 << 4) | (1 << 1)

export const EXP_TABLE = [
    1,
    2,
    4,
    8,
    16,
    32,
    64,
    128,
    29,
    58,
    116,
    232,
    205,
    135,
    19,
    38,
    76,
    152,
    45,
    90,
    180,
    117,
    234,
    201,
    143,
    3,
    6,
    12,
    24,
    48,
    96,
    192,
    157,
    39,
    78,
    156,
    37,
    74,
    148,
    53,
    106,
    212,
    181,
    119,
    238,
    193,
    159,
    35,
    70,
    140,
    5,
    10,
    20,
    40,
    80,
    160,
    93,
    186,
    105,
    210,
    185,
    111,
    222,
    161,
    95,
    190,
    97,
    194,
    153,
    47,
    94,
    188,
    101,
    202,
    137,
    15,
    30,
    60,
    120,
    240,
    253,
    231,
    211,
    187,
    107,
    214,
    177,
    127,
    254,
    225,
    223,
    163,
    91,
    182,
    113,
    226,
    217,
    175,
    67,
    134,
    17,
    34,
    68,
    136,
    13,
    26,
    52,
    104,
    208,
    189,
    103,
    206,
    129,
    31,
    62,
    124,
    248,
    237,
    199,
    147,
    59,
    118,
    236,
    197,
    151,
    51,
    102,
    204,
    133,
    23,
    46,
    92,
    184,
    109,
    218,
    169,
    79,
    158,
    33,
    66,
    132,
    21,
    42,
    84,
    168,
    77,
    154,
    41,
    82,
    164,
    85,
    170,
    73,
    146,
    57,
    114,
    228,
    213,
    183,
    115,
    230,
    209,
    191,
    99,
    198,
    145,
    63,
    126,
    252,
    229,
    215,
    179,
    123,
    246,
    241,
    255,
    227,
    219,
    171,
    75,
    150,
    49,
    98,
    196,
    149,
    55,
    110,
    220,
    165,
    87,
    174,
    65,
    130,
    25,
    50,
    100,
    200,
    141,
    7,
    14,
    28,
    56,
    112,
    224,
    221,
    167,
    83,
    166,
    81,
    162,
    89,
    178,
    121,
    242,
    249,
    239,
    195,
    155,
    43,
    86,
    172,
    69,
    138,
    9,
    18,
    36,
    72,
    144,
    61,
    122,
    244,
    245,
    247,
    243,
    251,
    235,
    203,
    139,
    11,
    22,
    44,
    88,
    176,
    125,
    250,
    233,
    207,
    131,
    27,
    54,
    108,
    216,
    173,
    71,
    142,
    1
]

export const LOG_TABLE = [
    null,
    0,
    1,
    25,
    2,
    50,
    26,
    198,
    3,
    223,
    51,
    238,
    27,
    104,
    199,
    75,
    4,
    100,
    224,
    14,
    52,
    141,
    239,
    129,
    28,
    193,
    105,
    248,
    200,
    8,
    76,
    113,
    5,
    138,
    101,
    47,
    225,
    36,
    15,
    33,
    53,
    147,
    142,
    218,
    240,
    18,
    130,
    69,
    29,
    181,
    194,
    125,
    106,
    39,
    249,
    185,
    201,
    154,
    9,
    120,
    77,
    228,
    114,
    166,
    6,
    191,
    139,
    98,
    102,
    221,
    48,
    253,
    226,
    152,
    37,
    179,
    16,
    145,
    34,
    136,
    54,
    208,
    148,
    206,
    143,
    150,
    219,
    189,
    241,
    210,
    19,
    92,
    131,
    56,
    70,
    64,
    30,
    66,
    182,
    163,
    195,
    72,
    126,
    110,
    107,
    58,
    40,
    84,
    250,
    133,
    186,
    61,
    202,
    94,
    155,
    159,
    10,
    21,
    121,
    43,
    78,
    212,
    229,
    172,
    115,
    243,
    167,
    87,
    7,
    112,
    192,
    247,
    140,
    128,
    99,
    13,
    103,
    74,
    222,
    237,
    49,
    197,
    254,
    24,
    227,
    165,
    153,
    119,
    38,
    184,
    180,
    124,
    17,
    68,
    146,
    217,
    35,
    32,
    137,
    46,
    55,
    63,
    209,
    91,
    149,
    188,
    207,
    205,
    144,
    135,
    151,
    178,
    220,
    252,
    190,
    97,
    242,
    86,
    211,
    171,
    20,
    42,
    93,
    158,
    132,
    60,
    57,
    83,
    71,
    109,
    65,
    162,
    31,
    45,
    67,
    216,
    183,
    123,
    164,
    118,
    196,
    23,
    73,
    236,
    127,
    12,
    111,
    246,
    108,
    161,
    59,
    82,
    41,
    157,
    85,
    170,
    251,
    96,
    134,
    177,
    187,
    204,
    62,
    90,
    203,
    89,
    95,
    176,
    156,
    169,
    160,
    81,
    11,
    245,
    22,
    235,
    122,
    117,
    44,
    215,
    79,
    174,
    213,
    233,
    230,
    231,
    173,
    232,
    116,
    214,
    244,
    234,
    168,
    80,
    88,
    175
]

export const RS_BLOCK_TABLE = [[1, 26, 19], [1, 26, 16], [1, 26, 13], [1, 26, 9], [1, 44, 34], [1, 44, 28], [1, 44, 22], [1, 44, 16], [1, 70, 55], [1, 70, 44], [2, 35, 17], [2, 35, 13], [1, 100, 80], [2, 50, 32], [2, 50, 24], [4, 25, 9], [1, 134, 108], [2, 67, 43], [2, 33, 15, 2, 34, 16], [2, 33, 11, 2, 34, 12], [2, 86, 68], [4, 43, 27], [4, 43, 19], [4, 43, 15], [2, 98, 78], [4, 49, 31], [2, 32, 14, 4, 33, 15], [4, 39, 13, 1, 40, 14], [2, 121, 97], [2, 60, 38, 2, 61, 39], [4, 40, 18, 2, 41, 19], [4, 40, 14, 2, 41, 15], [2, 146, 116], [3, 58, 36, 2, 59, 37], [4, 36, 16, 4, 37, 17], [4, 36, 12, 4, 37, 13], [2, 86, 68, 2, 87, 69], [4, 69, 43, 1, 70, 44], [6, 43, 19, 2, 44, 20], [6, 43, 15, 2, 44, 16], [4, 101, 81], [1, 80, 50, 4, 81, 51], [4, 50, 22, 4, 51, 23], [3, 36, 12, 8, 37, 13], [2, 116, 92, 2, 117, 93], [6, 58, 36, 2, 59, 37], [4, 46, 20, 6, 47, 21], [7, 42, 14, 4, 43, 15], [4, 133, 107], [8, 59, 37, 1, 60, 38], [8, 44, 20, 4, 45, 21], [12, 33, 11, 4, 34, 12], [3, 145, 115, 1, 146, 116], [4, 64, 40, 5, 65, 41], [11, 36, 16, 5, 37, 17], [11, 36, 12, 5, 37, 13], [5, 109, 87, 1, 110, 88], [5, 65, 41, 5, 66, 42], [5, 54, 24, 7, 55, 25], [11, 36, 12], [5, 122, 98, 1, 123, 99], [7, 73, 45, 3, 74, 46], [15, 43, 19, 2, 44, 20], [3, 45, 15, 13, 46, 16], [1, 135, 107, 5, 136, 108], [10, 74, 46, 1, 75, 47], [1, 50, 22, 15, 51, 23], [2, 42, 14, 17, 43, 15], [5, 150, 120, 1, 151, 121], [9, 69, 43, 4, 70, 44], [17, 50, 22, 1, 51, 23], [2, 42, 14, 19, 43, 15], [3, 141, 113, 4, 142, 114], [3, 70, 44, 11, 71, 45], [17, 47, 21, 4, 48, 22], [9, 39, 13, 16, 40, 14], [3, 135, 107, 5, 136, 108], [3, 67, 41, 13, 68, 42], [15, 54, 24, 5, 55, 25], [15, 43, 15, 10, 44, 16], [4, 144, 116, 4, 145, 117], [17, 68, 42], [17, 50, 22, 6, 51, 23], [19, 46, 16, 6, 47, 17], [2, 139, 111, 7, 140, 112], [17, 74, 46], [7, 54, 24, 16, 55, 25], [34, 37, 13], [4, 151, 121, 5, 152, 122], [4, 75, 47, 14, 76, 48], [11, 54, 24, 14, 55, 25], [16, 45, 15, 14, 46, 16], [6, 147, 117, 4, 148, 118], [6, 73, 45, 14, 74, 46], [11, 54, 24, 16, 55, 25], [30, 46, 16, 2, 47, 17], [8, 132, 106, 4, 133, 107], [8, 75, 47, 13, 76, 48], [7, 54, 24, 22, 55, 25], [22, 45, 15, 13, 46, 16], [10, 142, 114, 2, 143, 115], [19, 74, 46, 4, 75, 47], [28, 50, 22, 6, 51, 23], [33, 46, 16, 4, 47, 17], [8, 152, 122, 4, 153, 123], [22, 73, 45, 3, 74, 46], [8, 53, 23, 26, 54, 24], [12, 45, 15, 28, 46, 16], [3, 147, 117, 10, 148, 118], [3, 73, 45, 23, 74, 46], [4, 54, 24, 31, 55, 25], [11, 45, 15, 31, 46, 16], [7, 146, 116, 7, 147, 117], [21, 73, 45, 7, 74, 46], [1, 53, 23, 37, 54, 24], [19, 45, 15, 26, 46, 16], [5, 145, 115, 10, 146, 116], [19, 75, 47, 10, 76, 48], [15, 54, 24, 25, 55, 25], [23, 45, 15, 25, 46, 16], [13, 145, 115, 3, 146, 116], [2, 74, 46, 29, 75, 47], [42, 54, 24, 1, 55, 25], [23, 45, 15, 28, 46, 16], [17, 145, 115], [10, 74, 46, 23, 75, 47], [10, 54, 24, 35, 55, 25], [19, 45, 15, 35, 46, 16], [17, 145, 115, 1, 146, 116], [14, 74, 46, 21, 75, 47], [29, 54, 24, 19, 55, 25], [11, 45, 15, 46, 46, 16], [13, 145, 115, 6, 146, 116], [14, 74, 46, 23, 75, 47], [44, 54, 24, 7, 55, 25], [59, 46, 16, 1, 47, 17], [12, 151, 121, 7, 152, 122], [12, 75, 47, 26, 76, 48], [39, 54, 24, 14, 55, 25], [22, 45, 15, 41, 46, 16], [6, 151, 121, 14, 152, 122], [6, 75, 47, 34, 76, 48], [46, 54, 24, 10, 55, 25], [2, 45, 15, 64, 46, 16], [17, 152, 122, 4, 153, 123], [29, 74, 46, 14, 75, 47], [49, 54, 24, 10, 55, 25], [24, 45, 15, 46, 46, 16], [4, 152, 122, 18, 153, 123], [13, 74, 46, 32, 75, 47], [48, 54, 24, 14, 55, 25], [42, 45, 15, 32, 46, 16], [20, 147, 117, 4, 148, 118], [40, 75, 47, 7, 76, 48], [43, 54, 24, 22, 55, 25], [10, 45, 15, 67, 46, 16], [19, 148, 118, 6, 149, 119], [18, 75, 47, 31, 76, 48], [34, 54, 24, 34, 55, 25], [20, 45, 15, 61, 46, 16]];