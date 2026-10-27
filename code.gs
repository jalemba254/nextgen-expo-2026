// ============================================================
// NEXTGEN EXPO 2026
// COMPLETE UPDATED CODE.GS
// ============================================================
// PAYMENT SYSTEM:
// 1. Any agreed payment amount accepted
// 2. Standard Exhibitor
// 3. Premium Exhibition Space
// 4. M-Pesa transaction code required
// 5. M-Pesa receipt upload OPTIONAL
// 6. Optional receipt saved to Google Drive
// 7. Payment verification / rejection
// 8. Official payment confirmation
// 9. Payment lookup
// 10. Standard booth assignment
// 11. Premium custom space description
// 12. Exhibitor management
// 13. Visitor management
// 14. Exhibitor check-in
// 15. Visitor check-in
// 16. Dashboard statistics
// ============================================================


// ============================================================
// 1. SHEET NAMES
// ============================================================

var SHEET_NAMES = {
  EXHIBITORS: "EXHIBITORS",
  PAYMENTS: "PAYMENTS",
  BOOTHS: "BOOTHS",
  VISITORS: "VISITORS",
  SETTINGS: "SETTINGS"
};


// ============================================================
// 2. WEB APP ROUTING
// ============================================================

function doGet(e) {

  var page =
    e &&
    e.parameter &&
    e.parameter.page
      ? String(e.parameter.page).toLowerCase()
      : "registration";

  // ----------------------------------------------------------
  // RECEIPT PAGE
  // ----------------------------------------------------------

  if (page === "receipt") {

    return HtmlService
      .createTemplateFromFile("Receipt")
      .evaluate()
      .setTitle(
        "NextGen Expo 2026 - Payment Confirmation"
      )
      .setXFrameOptionsMode(
        HtmlService.XFrameOptionsMode.ALLOWALL
      );
  }

  // ----------------------------------------------------------
  // ADMIN PAGE
  // ----------------------------------------------------------

  if (page === "admin") {

    return HtmlService
      .createTemplateFromFile("Admin")
      .evaluate()
      .setTitle(
        "NextGen Expo 2026 Admin Dashboard"
      )
      .setXFrameOptionsMode(
        HtmlService.XFrameOptionsMode.ALLOWALL
      );
  }

  // ----------------------------------------------------------
  // DEFAULT REGISTRATION PAGE
  // ----------------------------------------------------------

  return HtmlService
    .createTemplateFromFile("Index")
    .evaluate()
    .setTitle(
      "NextGen Expo 2026 Exhibitor Registration"
    )
    .setXFrameOptionsMode(
      HtmlService.XFrameOptionsMode.ALLOWALL
    );
}


// ============================================================
// 3. GET SPREADSHEET
// ============================================================

function getSpreadsheet() {

  var ss =
    SpreadsheetApp.getActiveSpreadsheet();

  if (!ss) {

    throw new Error(
      "Unable to access the active spreadsheet."
    );
  }

  return ss;
}


// ============================================================
// 4. GET SHEET
// ============================================================

function getSheet(sheetName) {

  var sheet =
    getSpreadsheet()
      .getSheetByName(sheetName);

  if (!sheet) {

    throw new Error(
      "Sheet not found: " +
      sheetName
    );
  }

  return sheet;
}


// ============================================================
// 5. GET SETTINGS
// ============================================================

function getSettings() {

  var sheet =
    getSheet(
      SHEET_NAMES.SETTINGS
    );

  var data =
    sheet
      .getDataRange()
      .getValues();

  var settings = {};

  for (
    var i = 1;
    i < data.length;
    i++
  ) {

    var key =
      String(
        data[i][0] || ""
      ).trim();

    if (key) {

      settings[key] =
        data[i][1];
    }
  }

  return settings;
}


// ============================================================
// 6. GET SETTING VALUE
// ============================================================

function getSettingValue(key) {

  var settings =
    getSettings();

  return settings[key] || "";
}


// ============================================================
// 7. REGISTRATION FEE
// ============================================================
// NOTE:
// This value is now INFORMATIONAL ONLY.
// It is NOT used to force a payment amount.
// Exhibitors can enter any amount agreed with
// the NextGen Expo administration.
// ============================================================

function getRegistrationFee() {

  var fee =
    Number(
      getSettingValue(
        "Registration Fee"
      )
    );

  if (
    isNaN(fee) ||
    fee <= 0
  ) {

    return 0;
  }

  return fee;
}


// ============================================================
// 8. PREMIUM SPACE FEE
// ============================================================
// INFORMATIONAL ONLY.
// It is NOT used to force a payment amount.
// ============================================================

function getPremiumSpaceFee() {

  var settings =
    getSettings();

  var fee =
    Number(
      settings["Premium spece fee"] ||
      settings["Premium space fee"] ||
      settings["Premium Space Fee"]
    );

  if (
    isNaN(fee) ||
    fee <= 0
  ) {

    return 0;
  }

  return fee;
}


// ============================================================
// 9. NORMALIZE EXHIBITOR TYPE
// ============================================================

function normalizeExhibitorType(type) {

  var value =
    String(type || "")
      .trim()
      .toLowerCase();

  if (
    value ===
      "premium exhibition space" ||
    value === "premium" ||
    value === "premium space"
  ) {

    return "Premium Exhibition Space";
  }

  return "Standard Exhibitor";
}


// ============================================================
// 10. REQUIRED FEE
// ============================================================
// No fixed fee is enforced.
// This function is retained for compatibility
// with existing dashboard code.
// ============================================================

function getRequiredFee(exhibitorType) {

  // Any agreed positive amount is accepted.

  return 0;
}


// ============================================================
// 11. ADMIN LOGIN
// ============================================================

function checkAdminLogin(
  username,
  password
) {

  var settings =
    getSettings();

  var savedUsername =
    String(
      settings["Admin Username"] ||
      "admin"
    ).trim();

  var savedPassword =
    String(
      settings["Admin Pasword"] ||
      settings["Admin Password"] ||
      "1234"
    ).trim();

  if (

    String(username || "")
      .trim() ===
      savedUsername &&

    String(password || "")
      .trim() ===
      savedPassword

  ) {

    return {

      success: true,

      message:
        "Login successful."

    };
  }

  return {

    success: false,

    message:
      "Invalid username or password."
  };
}


// ============================================================
// 12. GET PAYMENTS
// ============================================================

function getPayments() {

  return getSheet(
    SHEET_NAMES.PAYMENTS
  )
    .getDataRange()
    .getDisplayValues();
}


// ============================================================
// 13. GET EXHIBITORS
// ============================================================

function getExhibitors() {

  return getSheet(
    SHEET_NAMES.EXHIBITORS
  )
    .getDataRange()
    .getDisplayValues();
}


// ============================================================
// 14. GET VISITORS
// ============================================================

function getVisitors() {

  return getSheet(
    SHEET_NAMES.VISITORS
  )
    .getDataRange()
    .getDisplayValues();
}


// ============================================================
// 15. GET BOOTHS
// ============================================================

function getBooths() {

  return getSheet(
    SHEET_NAMES.BOOTHS
  )
    .getDataRange()
    .getDisplayValues();
}


// ============================================================
// 16. PAYMENT DASHBOARD STATISTICS
// ============================================================

function getDashboardStats() {

  var data =
    getSheet(
      SHEET_NAMES.PAYMENTS
    )
      .getDataRange()
      .getValues();

  var totalPayments = 0;
  var verifiedPayments = 0;
  var pendingPayments = 0;
  var rejectedPayments = 0;
  var standardPayments = 0;
  var premiumPayments = 0;
  var revenue = 0;

  for (
    var i = 1;
    i < data.length;
    i++
  ) {

    if (!data[i][0]) {
      continue;
    }

    totalPayments++;

    // PAYMENT COLUMNS:
    // A Payment ID
    // B Exhibitor ID
    // C Full Name
    // D Phone
    // E Exhibitor Type
    // F Amount
    // G M-Pesa Code
    // H Payment Date
    // I Verification Status
    // J Verified By
    // K Notes
    // L Receipt URL
    // M Download URL

    var type =
      normalizeExhibitorType(
        data[i][4]
      );

    var amount =
      Number(
        data[i][5]
      ) || 0;

    var status =
      String(
        data[i][8] || ""
      )
        .trim()
        .toLowerCase();

    if (
      type ===
      "Premium Exhibition Space"
    ) {

      premiumPayments++;

    } else {

      standardPayments++;
    }

    if (
      status === "verified"
    ) {

      verifiedPayments++;

      revenue += amount;

    } else if (
      status ===
      "pending verification"
    ) {

      pendingPayments++;

    } else if (
      status === "rejected"
    ) {

      rejectedPayments++;
    }
  }

  return {

    totalPayments:
      totalPayments,

    verifiedPayments:
      verifiedPayments,

    pendingPayments:
      pendingPayments,

    rejectedPayments:
      rejectedPayments,

    standardPayments:
      standardPayments,

    premiumPayments:
      premiumPayments,

    revenue:
      revenue
  };
}


// ============================================================
// 17. VERIFY OR REJECT PAYMENT
// ============================================================

function verifyPayment(
  paymentId,
  newStatus,
  verifiedBy
) {

  var sheet =
    getSheet(
      SHEET_NAMES.PAYMENTS
    );

  var data =
    sheet
      .getDataRange()
      .getValues();

  paymentId =
    String(
      paymentId || ""
    ).trim();

  newStatus =
    String(
      newStatus || ""
    ).trim();

  for (
    var i = 1;
    i < data.length;
    i++
  ) {

    if (

      String(
        data[i][0] || ""
      ).trim() ===
      paymentId

    ) {

      var row =
        i + 1;

      // PAYMENT COLUMNS
      // E = Exhibitor Type
      // F = Amount
      // I = Verification Status
      // J = Verified By
      // K = Notes

      var exhibitorType =
        normalizeExhibitorType(
          data[i][4]
        );

      var amount =
        Number(
          data[i][5]
        ) || 0;

      var statusLower =
        newStatus
          .toLowerCase();

      // ------------------------------------------------------
      // VERIFY PAYMENT
      // ------------------------------------------------------

      if (
        statusLower ===
        "verified"
      ) {

        // ANY POSITIVE AMOUNT IS ALLOWED

        if (
          amount <= 0
        ) {

          return {

            success: false,

            message:
              "Payment cannot be verified because the recorded amount is invalid."

          };
        }

        newStatus =
          "Verified";
      }

      // ------------------------------------------------------
      // REJECT PAYMENT
      // ------------------------------------------------------

      else if (
        statusLower ===
        "rejected"
      ) {

        newStatus =
          "Rejected";

      } else {

        return {

          success: false,

          message:
            "Invalid payment status."

        };
      }

      // ------------------------------------------------------
      // UPDATE PAYMENT STATUS
      // ------------------------------------------------------

      sheet
        .getRange(
          row,
          9
        )
        .setValue(
          newStatus
        );

      // ------------------------------------------------------
      // VERIFIED BY
      // ------------------------------------------------------

      sheet
        .getRange(
          row,
          10
        )
        .setValue(
          verifiedBy ||
          "Admin"
        );

      // ------------------------------------------------------
      // NOTES
      // ------------------------------------------------------

      sheet
        .getRange(
          row,
          11
        )
        .setValue(

          newStatus ===
          "Verified"

            ? "Payment verified successfully. Amount accepted as agreed with administration."

            : "Payment rejected."

        );

      // ------------------------------------------------------
      // UPDATE EXHIBITOR
      // ------------------------------------------------------

      updateExhibitorPaymentStatus(

        data[i][1],

        newStatus

      );

      return {

        success: true,

        message:
          exhibitorType +
          " payment of KES " +
          amount +
          " " +
          newStatus.toLowerCase() +
          " successfully."

      };
    }
  }

  return {

    success: false,

    message:
      "Payment ID not found."
  };
}


// ============================================================
// 18. UPDATE EXHIBITOR PAYMENT STATUS
// ============================================================

function updateExhibitorPaymentStatus(
  exhibitorId,
  status
) {

  var sheet =
    getSheet(
      SHEET_NAMES.EXHIBITORS
    );

  var data =
    sheet
      .getDataRange()
      .getValues();

  for (
    var i = 1;
    i < data.length;
    i++
  ) {

    if (

      String(
        data[i][1] || ""
      )
        .trim()
        .toUpperCase() ===

      String(
        exhibitorId || ""
      )
        .trim()
        .toUpperCase()

    ) {

      // Column J
      // Payment Status

      sheet
        .getRange(
          i + 1,
          10
        )
        .setValue(
          status
        );

      return true;
    }
  }

  return false;
}


// ============================================================
// 19. UPDATE PREMIUM SPACE DESCRIPTION
// ============================================================

function updatePremiumSpaceDescription(
  exhibitorId,
  description
) {

  var sheet =
    getSheet(
      SHEET_NAMES.EXHIBITORS
    );

  var data =
    sheet
      .getDataRange()
      .getValues();

  exhibitorId =
    String(
      exhibitorId || ""
    )
      .trim()
      .toUpperCase();

  description =
    String(
      description || ""
    ).trim();

  if (!exhibitorId) {

    return {

      success: false,

      message:
        "Exhibitor ID is required."

    };
  }

  if (!description) {

    return {

      success: false,

      message:
        "Space description is required."

    };
  }

  for (
    var i = 1;
    i < data.length;
    i++
  ) {

    if (

      String(
        data[i][1] || ""
      )
        .trim()
        .toUpperCase() ===
      exhibitorId

    ) {

      // Column M
      // Space Description

      sheet
        .getRange(
          i + 1,
          13
        )
        .setValue(
          description
        );

      return {

        success: true,

        message:
          "Premium space description saved successfully."

      };
    }
  }

  return {

    success: false,

    message:
      "Exhibitor not found."
  };
}


// ============================================================
// 20. GET EXHIBITOR FOR CHECK-IN
// ============================================================

function getExhibitorForCheckIn(
  exhibitorId
) {

  var data =
    getSheet(
      SHEET_NAMES.EXHIBITORS
    )
      .getDataRange()
      .getDisplayValues();

  exhibitorId =
    String(
      exhibitorId || ""
    )
      .trim()
      .toUpperCase();

  for (
    var i = 1;
    i < data.length;
    i++
  ) {

    if (

      String(
        data[i][1] || ""
      )
        .trim()
        .toUpperCase() ===
      exhibitorId

    ) {

      var exhibitorType =
        normalizeExhibitorType(
          data[i][5]
        );

      return {

        success: true,

        exhibitorId:
          data[i][1],

        fullName:
          data[i][2],

        phone:
          data[i][3],

        email:
          data[i][4],

        category:
          data[i][5],

        businessName:
          data[i][6],

        amountPaid:
          data[i][7],

        mpesaCode:
          data[i][8],

        paymentStatus:
          data[i][9],

        checkInStatus:
          data[i][10],

        notes:
          data[i][11],

        spaceDescription:
          data[i][12],

        boothNumber:
          findBoothForExhibitor(
            data[i][1]
          )

      };
    }
  }

  return {

    success: false,

    message:
      "Exhibitor not found."
  };
}


// ============================================================
// 21. CHECK IN EXHIBITOR
// ============================================================

function checkInExhibitor(
  exhibitorId,
  staffName
) {

  var sheet =
    getSheet(
      SHEET_NAMES.EXHIBITORS
    );

  var data =
    sheet
      .getDataRange()
      .getValues();

  exhibitorId =
    String(
      exhibitorId || ""
    )
      .trim()
      .toUpperCase();

  for (
    var i = 1;
    i < data.length;
    i++
  ) {

    if (

      String(
        data[i][1] || ""
      )
        .trim()
        .toUpperCase() ===
      exhibitorId

    ) {

      var row =
        i + 1;

      var paymentStatus =
        String(
          data[i][9] || ""
        )
          .trim()
          .toLowerCase();

      if (
        paymentStatus !==
        "verified"
      ) {

        return {

          success: false,

          message:
            "Exhibitor payment is not verified."

        };
      }

      // Column K
      // Check-in status

      sheet
        .getRange(
          row,
          11
        )
        .setValue(
          "Checked In"
        );

      // Column L
      // Notes

      sheet
        .getRange(
          row,
          12
        )
        .setValue(

          "Checked in by " +
          (
            staffName ||
            "Admin"
          ) +
          " on " +
          new Date()

        );

      return {

        success: true,

        message:
          "Exhibitor checked in successfully."

      };
    }
  }

  return {

    success: false,

    message:
      "Exhibitor not found."
  };
}


// ============================================================
// 22. FIND BOOTH FOR EXHIBITOR
// ============================================================

function findBoothForExhibitor(
  exhibitorId
) {

  var data =
    getSheet(
      SHEET_NAMES.BOOTHS
    )
      .getDataRange()
      .getDisplayValues();

  exhibitorId =
    String(
      exhibitorId || ""
    )
      .trim()
      .toUpperCase();

  for (
    var i = 1;
    i < data.length;
    i++
  ) {

    if (

      String(
        data[i][1] || ""
      )
        .trim()
        .toUpperCase() ===
      exhibitorId

    ) {

      return data[i][0];
    }
  }

  return "Not Assigned";
}


// ============================================================
// 23. ASSIGN STANDARD BOOTH
// ============================================================

function assignBooth(
  boothNumber,
  exhibitorId
) {

  boothNumber =
    String(
      boothNumber || ""
    )
      .trim()
      .toUpperCase();

  exhibitorId =
    String(
      exhibitorId || ""
    )
      .trim()
      .toUpperCase();

  if (
    !boothNumber ||
    !exhibitorId
  ) {

    return {

      success: false,

      message:
        "Booth Number and Exhibitor ID are required."

    };
  }

  var exhibitorSheet =
    getSheet(
      SHEET_NAMES.EXHIBITORS
    );

  var exhibitors =
    exhibitorSheet
      .getDataRange()
      .getValues();

  var exhibitorFound =
    false;

  var exhibitorType =
    "";

  var businessName =
    "";

  var category =
    "";

  var phone =
    "";

  var paymentStatus =
    "";

  for (
    var i = 1;
    i < exhibitors.length;
    i++
  ) {

    if (

      String(
        exhibitors[i][1] || ""
      )
        .trim()
        .toUpperCase() ===
      exhibitorId

    ) {

      exhibitorFound =
        true;

      exhibitorType =
        normalizeExhibitorType(
          exhibitors[i][5]
        );

      businessName =
        exhibitors[i][6];

      category =
        exhibitors[i][5];

      phone =
        exhibitors[i][3];

      paymentStatus =
        exhibitors[i][9];

      break;
    }
  }

  if (!exhibitorFound) {

    return {

      success: false,

      message:
        "Exhibitor ID not found."

    };
  }

  // Premium exhibitors use custom space descriptions.

  if (
    exhibitorType ===
    "Premium Exhibition Space"
  ) {

    return {

      success: false,

      message:
        "This exhibitor has Premium Exhibition Space. Please use the Premium Space Description function instead of assigning a standard booth."

    };
  }

  if (

    String(
      paymentStatus || ""
    )
      .trim()
      .toLowerCase() !==
    "verified"

  ) {

    return {

      success: false,

      message:
        "This exhibitor does not have a verified payment."

    };
  }

  var boothSheet =
    getSheet(
      SHEET_NAMES.BOOTHS
    );

  var booths =
    boothSheet
      .getDataRange()
      .getValues();

  for (
    var j = 1;
    j < booths.length;
    j++
  ) {

    var existingBooth =
      String(
        booths[j][0] || ""
      )
        .trim()
        .toUpperCase();

    var existingExhibitor =
      String(
        booths[j][1] || ""
      )
        .trim()
        .toUpperCase();

    if (
      existingExhibitor ===
      exhibitorId
    ) {

      return {

        success: false,

        message:
          "This exhibitor already has booth " +
          existingBooth +
          "."

      };
    }

    if (
      existingBooth ===
      boothNumber
    ) {

      return {

        success: false,

        message:
          "Booth " +
          boothNumber +
          " is already occupied."

      };
    }
  }

  // BOOTHS COLUMNS:
  // A Booth Number
  // B Exhibitor ID
  // C Business Name
  // D Category
  // E Phone
  // F Payment Status
  // G Booth Status
  // H Notes

  boothSheet.appendRow([

    boothNumber,

    exhibitorId,

    businessName,

    category,

    phone,

    "Paid",

    "Occupied",

    ""

  ]);

  return {

    success: true,

    message:
      "Booth " +
      boothNumber +
      " assigned successfully."

  };
}


// ============================================================
// 24. ASSIGN PREMIUM SPACE
// ============================================================

function assignPremiumSpace(
  exhibitorId,
  spaceDescription
) {

  exhibitorId =
    String(
      exhibitorId || ""
    )
      .trim()
      .toUpperCase();

  spaceDescription =
    String(
      spaceDescription || ""
    ).trim();

  if (!exhibitorId) {

    return {

      success: false,

      message:
        "Exhibitor ID is required."

    };
  }

  if (!spaceDescription) {

    return {

      success: false,

      message:
        "Please enter the custom space description."

    };
  }

  var sheet =
    getSheet(
      SHEET_NAMES.EXHIBITORS
    );

  var data =
    sheet
      .getDataRange()
      .getValues();

  for (
    var i = 1;
    i < data.length;
    i++
  ) {

    if (

      String(
        data[i][1] || ""
      )
        .trim()
        .toUpperCase() ===
      exhibitorId

    ) {

      var type =
        normalizeExhibitorType(
          data[i][5]
        );

      if (
        type !==
        "Premium Exhibition Space"
      ) {

        return {

          success: false,

          message:
            "This exhibitor is not registered for Premium Exhibition Space."

        };
      }

      var paymentStatus =
        String(
          data[i][9] || ""
        )
          .trim()
          .toLowerCase();

      if (
        paymentStatus !==
        "verified"
      ) {

        return {

          success: false,

          message:
            "Premium payment must be verified before assigning the space."

        };
      }

      // Column M
      // Space Description

      sheet
        .getRange(
          i + 1,
          13
        )
        .setValue(
          spaceDescription
        );

      return {

        success: true,

        message:
          "Premium Exhibition Space assigned successfully.",

        spaceDescription:
          spaceDescription

      };
    }
  }

  return {

    success: false,

    message:
      "Exhibitor not found."
  };
}


// ============================================================
// 25. GET EXHIBITOR DETAILS
// ============================================================

function getExhibitorDetails(
  exhibitorId
) {

  var data =
    getSheet(
      SHEET_NAMES.EXHIBITORS
    )
      .getDataRange()
      .getDisplayValues();

  exhibitorId =
    String(
      exhibitorId || ""
    )
      .trim()
      .toUpperCase();

  for (
    var i = 1;
    i < data.length;
    i++
  ) {

    if (

      String(
        data[i][1] || ""
      )
        .trim()
        .toUpperCase() ===
      exhibitorId

    ) {

      return {

        success: true,

        exhibitorId:
          data[i][1],

        fullName:
          data[i][2],

        phone:
          data[i][3],

        email:
          data[i][4],

        category:
          data[i][5],

        businessName:
          data[i][6],

        amountPaid:
          data[i][7],

        mpesaCode:
          data[i][8],

        paymentStatus:
          data[i][9],

        checkInStatus:
          data[i][10],

        notes:
          data[i][11],

        spaceDescription:
          data[i][12]

      };
    }
  }

  return {

    success: false,

    message:
      "Exhibitor not found."
  };
}


// ============================================================
// 26. GET OFFICIAL PAYMENT CONFIRMATION
// ============================================================

function getExhibitorReceipt(
  paymentId,
  exhibitorId
) {

  paymentId =
    String(
      paymentId || ""
    ).trim();

  exhibitorId =
    String(
      exhibitorId || ""
    ).trim();

  if (!paymentId) {

    return {

      success: false,

      message:
        "Payment ID is missing."

    };
  }

  var paymentData =
    getSheet(
      SHEET_NAMES.PAYMENTS
    )
      .getDataRange()
      .getDisplayValues();

  for (
    var i = 1;
    i < paymentData.length;
    i++
  ) {

    var storedPaymentId =
      String(
        paymentData[i][0] || ""
      ).trim();

    if (

      storedPaymentId
        .toUpperCase() ===
      paymentId
        .toUpperCase()

    ) {

      var storedExhibitorId =
        String(
          paymentData[i][1] || ""
        ).trim();

      // SECURITY CHECK

      if (

        exhibitorId &&

        storedExhibitorId
          .toUpperCase() !==
        exhibitorId
          .toUpperCase()

      ) {

        return {

          success: false,

          message:
            "The Payment ID and Exhibitor ID do not match."

        };
      }

      var exhibitor =
        getExhibitorDetails(
          storedExhibitorId
        );

      var paymentStatus =
        String(
          paymentData[i][8] || ""
        ).trim();

      var statusLower =
        paymentStatus
          .toLowerCase();

      var isVerified =
        statusLower ===
        "verified";

      var exhibitorType =
        normalizeExhibitorType(
          paymentData[i][4]
        );

      var boothNumber =
        findBoothForExhibitor(
          storedExhibitorId
        );

      var spaceDescription =
        exhibitor.success
          ? exhibitor.spaceDescription || ""
          : "";

      return {

        success: true,

        eventName:
          "NextGen Expo 2026",

        eventDate:
          "14-15 August 2026",

        venue:
          "Jericho Market",

        startTime:
          "9:00 AM",

        endTime:
          "5:00 PM",

        paymentId:
          paymentData[i][0],

        exhibitorId:
          storedExhibitorId,

        exhibitorType:
          exhibitorType,

        fullName:
          paymentData[i][2] ||
          (
            exhibitor.fullName ||
            ""
          ),

        phone:
          paymentData[i][3] ||
          (
            exhibitor.phone ||
            ""
          ),

        email:
          exhibitor.email ||
          "",

        businessName:
          exhibitor.businessName ||
          "",

        category:
          exhibitor.category ||
          "",

        amount:
          paymentData[i][5],

        currency:
          "KES",

        mpesaCode:
          paymentData[i][6],

        paymentDate:
          paymentData[i][7],

        status:
          paymentStatus,

        verified:
          isVerified,

        verifiedBy:
          paymentData[i][9] ||
          "",

        notes:
          paymentData[i][10] ||
          "",

        receiptUrl:
          paymentData[i][11] ||
          "",

        downloadUrl:
          paymentData[i][12] ||
          "",

        boothNumber:
          boothNumber,

        spaceDescription:
          spaceDescription,

        message:

          isVerified

            ? "Payment verified successfully. Your official payment confirmation is ready."

            : statusLower ===
              "pending verification"

              ? "Your payment has been received and is awaiting verification."

              : statusLower ===
                "rejected"

                ? "This payment has been rejected. Please contact the NextGen Expo team."

                : "Payment record found. Current status: " +
                  paymentStatus

      };
    }
  }

  return {

    success: false,

    message:
      "No payment record was found for the Payment ID provided."
  };
}


// ============================================================
// 27. GET VISITOR FOR CHECK-IN
// ============================================================

function getVisitorForCheckIn(
  visitorId
) {

  var data =
    getSheet(
      SHEET_NAMES.VISITORS
    )
      .getDataRange()
      .getDisplayValues();

  visitorId =
    String(
      visitorId || ""
    )
      .trim()
      .toUpperCase();

  for (
    var i = 1;
    i < data.length;
    i++
  ) {

    if (

      String(
        data[i][0] || ""
      )
        .trim()
        .toUpperCase() ===
      visitorId

    ) {

      return {

        success: true,

        visitorId:
          data[i][0],

        fullName:
          data[i][1],

        phone:
          data[i][2],

        email:
          data[i][3],

        registrationDate:
          data[i][4],

        checkInStatus:
          data[i][5],

        checkInTime:
          data[i][6]

      };
    }
  }

  return {

    success: false,

    message:
      "Visitor not found."
  };
}


// ============================================================
// 28. CHECK IN VISITOR
// ============================================================

function checkInVisitor(
  visitorId,
  staffName
) {

  var sheet =
    getSheet(
      SHEET_NAMES.VISITORS
    );

  var data =
    sheet
      .getDataRange()
      .getValues();

  visitorId =
    String(
      visitorId || ""
    )
      .trim()
      .toUpperCase();

  for (
    var i = 1;
    i < data.length;
    i++
  ) {

    if (

      String(
        data[i][0] || ""
      )
        .trim()
        .toUpperCase() ===
      visitorId

    ) {

      var row =
        i + 1;

      var currentStatus =
        String(
          data[i][5] || ""
        )
          .trim()
          .toLowerCase();

      if (
        currentStatus ===
        "checked in"
      ) {

        return {

          success: false,

          message:
            "Visitor is already checked in."

        };
      }

      // Column F
      // Check-in-Status

      sheet
        .getRange(
          row,
          6
        )
        .setValue(
          "Checked In"
        );

      // Column G
      // Check-in-Time

      sheet
        .getRange(
          row,
          7
        )
        .setValue(
          new Date()
        );

      return {

        success: true,

        message:
          "Visitor checked in successfully by " +
          (
            staffName ||
            "Admin"
          ) +
          "."

      };
    }
  }

  return {

    success: false,

    message:
      "Visitor not found."
  };
}


// ============================================================
// 29. VISITOR DASHBOARD STATISTICS
// ============================================================

function getVisitorDashboardStats() {

  var data =
    getSheet(
      SHEET_NAMES.VISITORS
    )
      .getDataRange()
      .getValues();

  var totalVisitors =
    0;

  var checkedInVisitors =
    0;

  var notCheckedInVisitors =
    0;

  for (
    var i = 1;
    i < data.length;
    i++
  ) {

    if (!data[i][0]) {
      continue;
    }

    totalVisitors++;

    var status =
      String(
        data[i][5] || ""
      )
        .trim()
        .toLowerCase();

    if (
      status ===
      "checked in"
    ) {

      checkedInVisitors++;

    } else {

      notCheckedInVisitors++;
    }
  }

  return {

    success: true,

    totalVisitors:
      totalVisitors,

    checkedInVisitors:
      checkedInVisitors,

    notCheckedInVisitors:
      notCheckedInVisitors
  };
}


// ============================================================
// 30. GET EVENT INFORMATION
// ============================================================

function getEventInfo() {

  var settings =
    getSettings();

  return {

    eventName:
      settings["Event Name"] ||
      "NextGen Expo 2026",

    eventDate:
      settings["Event Date"] ||
      "14-15 August 2026",

    venue:
      settings["Venue"] ||
      "Jericho Market",

    startTime:
      settings["Start Time"] ||
      "9:00 AM",

    endTime:
      settings["End Time"] ||
      "5:00 PM",

    contactNumber:
      settings["Contact Number"] ||
      "721455960",

    // Informational values only.
    // They are NOT enforced.

    registrationFee:
      getRegistrationFee(),

    premiumSpaceFee:
      getPremiumSpaceFee(),

    currency:
      settings["Currency"] ||
      "KES",

    paymentMethod:
      settings["Payment Method"] ||
      "M-Pesa",

    paymentInstructions:
      settings["Payment Instructions"] ||
      "Send the amount agreed with the NextGen Expo administration via M-Pesa.",

    eventStatus:
      settings["Event Status"] ||
      "Open"
  };
}


// ============================================================
// 31. SAVE PAYMENT RECEIPT TO GOOGLE DRIVE
// ============================================================
// OPTIONAL RECEIPT
// ============================================================

function savePaymentReceipt(
  receiptData,
  paymentId,
  exhibitorId
) {

  // No receipt supplied.
  // This is NOT an error anymore.

  if (
    !receiptData ||
    !receiptData.base64
  ) {

    return {

      success: true,

      uploaded: false,

      fileId: "",

      fileName: "",

      viewUrl: "",

      downloadUrl: ""

    };
  }

  try {

    var folderName =
      "NextGen Expo 2026 Payment Receipts";

    var folders =
      DriveApp
        .getFoldersByName(
          folderName
        );

    var folder;

    if (
      folders.hasNext()
    ) {

      folder =
        folders.next();

    } else {

      folder =
        DriveApp
          .createFolder(
            folderName
          );
    }

    var fileName =
      receiptData.fileName ||
      (
        "Receipt-" +
        paymentId
      );

    var mimeType =
      receiptData.mimeType ||
      "application/octet-stream";

    var base64Data =
      receiptData.base64;

    if (
      base64Data.indexOf(",") !==
      -1
    ) {

      base64Data =
        base64Data
          .split(",")[1];
    }

    var decodedData =
      Utilities
        .base64Decode(
          base64Data
        );

    var blob =
      Utilities
        .newBlob(
          decodedData,
          mimeType,
          fileName
        );

    var file =
      folder
        .createFile(
          blob
        );

    file.setName(

      paymentId +
      "_" +
      exhibitorId +
      "_" +
      fileName

    );

    file.setSharing(

      DriveApp.Access.ANYONE_WITH_LINK,

      DriveApp.Permission.VIEW

    );

    return {

      success: true,

      uploaded: true,

      fileId:
        file.getId(),

      fileName:
        file.getName(),

      viewUrl:
        "https://drive.google.com/file/d/" +
        file.getId() +
        "/view",

      downloadUrl:
        "https://drive.google.com/uc?export=download&id=" +
        file.getId()

    };

  } catch (error) {

    return {

      success: false,

      uploaded: false,

      message:
        "Receipt upload failed: " +
        error.message

    };
  }
}


// ============================================================
// 32. SUBMIT EXHIBITOR REGISTRATION
// ============================================================

function submitRegistration(data) {

  if (!data) {

    return {

      success: false,

      message:
        "No registration data was received."

    };
  }

  var fullName =
    String(
      data.fullName || ""
    ).trim();

  var phone =
    String(
      data.phone || ""
    ).trim();

  var email =
    String(
      data.email || ""
    ).trim();

  var category =
    String(
      data.category || ""
    ).trim();

  var businessName =
    String(
      data.businessName || ""
    ).trim();

  var amountPaid =
    Number(
      data.amountPaid || 0
    );

  var mpesaCode =
    String(
      data.mpesaCode || ""
    ).trim();

  var exhibitorType =
    normalizeExhibitorType(
      data.exhibitorType
    );

  // ----------------------------------------------------------
  // VALIDATION
  // ----------------------------------------------------------

  if (!fullName) {

    return {

      success: false,

      message:
        "Full name is required."

    };
  }

  if (!phone) {

    return {

      success: false,

      message:
        "Phone number is required."

    };
  }

  if (!email) {

    return {

      success: false,

      message:
        "Email address is required."

    };
  }

  if (!category) {

    return {

      success: false,

      message:
        "Category is required."

    };
  }

  if (!businessName) {

    return {

      success: false,

      message:
        "Business name is required."

    };
  }

  // ----------------------------------------------------------
  // ANY POSITIVE AMOUNT IS ACCEPTED
  // ----------------------------------------------------------

  if (
    isNaN(amountPaid) ||
    amountPaid <= 0
  ) {

    return {

      success: false,

      message:
        "Please enter the amount you actually paid. The amount can be any amount agreed with the NextGen Expo administration."

    };
  }

  // ----------------------------------------------------------
  // M-PESA CODE IS STILL REQUIRED
  // ----------------------------------------------------------

  if (!mpesaCode) {

    return {

      success: false,

      message:
        "M-Pesa transaction code is required."

    };
  }

  // ----------------------------------------------------------
  // RECEIPT IS OPTIONAL
  // ----------------------------------------------------------
  // No validation here.
  // The registration can continue without a receipt.
  // ----------------------------------------------------------

  var exhibitorSheet =
    getSheet(
      SHEET_NAMES.EXHIBITORS
    );

  var paymentSheet =
    getSheet(
      SHEET_NAMES.PAYMENTS
    );

  // ----------------------------------------------------------
  // DUPLICATE M-PESA CHECK
  // ----------------------------------------------------------

  var paymentData =
    paymentSheet
      .getDataRange()
      .getValues();

  for (
    var i = 1;
    i < paymentData.length;
    i++
  ) {

    var existingCode =
      String(
        paymentData[i][6] || ""
      )
        .trim()
        .toUpperCase();

    if (
      existingCode ===
      mpesaCode
        .toUpperCase()
    ) {

      return {

        success: false,

        message:
          "This M-Pesa transaction code has already been submitted."

      };
    }
  }

  // ----------------------------------------------------------
  // GENERATE IDS
  // ----------------------------------------------------------

  var exhibitorId =
    "NGX-EX-" +
    Utilities
      .getUuid()
      .substring(
        0,
        8
      )
      .toUpperCase();

  var paymentId =
    "NGX-PAY-" +
    Utilities
      .getUuid()
      .substring(
        0,
        8
      )
      .toUpperCase();

  var registrationDate =
    new Date();

  // ----------------------------------------------------------
  // OPTIONAL RECEIPT UPLOAD
  // ----------------------------------------------------------

  var receiptResult =
    savePaymentReceipt(

      data.receipt || null,

      paymentId,

      exhibitorId

    );

  if (
    !receiptResult.success
  ) {

    return {

      success: false,

      message:
        receiptResult.message

    };
  }

  // ----------------------------------------------------------
  // SAVE EXHIBITOR
  // ----------------------------------------------------------

  // EXHIBITORS:
  // A Time stamp
  // B Registration ID
  // C Full Name
  // D Phone
  // E Email
  // F Category / Exhibitor Type
  // G Business Name
  // H Amount Paid
  // I M-Pesa Code
  // J Payment Status
  // K Check-in Status
  // L Notes
  // M Space Description

  exhibitorSheet
    .appendRow([

      registrationDate,

      exhibitorId,

      fullName,

      phone,

      email,

      exhibitorType,

      businessName,

      amountPaid,

      mpesaCode,

      "Pending Verification",

      "Not Checked In",

      "",

      ""

    ]);

  // ----------------------------------------------------------
  // SAVE PAYMENT
  // ----------------------------------------------------------

  // PAYMENTS:
  // A Payment ID
  // B Exhibitor ID
  // C Full Name
  // D Phone
  // E Exhibitor Type
  // F Amount
  // G M-Pesa Code
  // H Payment Date
  // I Verification Status
  // J Verified By
  // K Notes
  // L Receipt URL
  // M Download URL

  paymentSheet
    .appendRow([

      paymentId,

      exhibitorId,

      fullName,

      phone,

      exhibitorType,

      amountPaid,

      mpesaCode,

      registrationDate,

      "Pending Verification",

      "",

      receiptResult.uploaded
        ? "Payment received. Receipt uploaded. Awaiting verification."
        : "Payment received. No receipt uploaded. Awaiting verification.",

      receiptResult.viewUrl || "",

      receiptResult.downloadUrl || ""

    ]);

  // ----------------------------------------------------------
  // BUILD CONFIRMATION URL
  // ----------------------------------------------------------

  var webAppUrl =
    ScriptApp
      .getService()
      .getUrl();

  var confirmationUrl =
    webAppUrl +
    "?page=receipt" +
    "&paymentId=" +
    encodeURIComponent(
      paymentId
    ) +
    "&exhibitorId=" +
    encodeURIComponent(
      exhibitorId
    );

  // ----------------------------------------------------------
  // SUCCESS RESPONSE
  // ----------------------------------------------------------

  return {

    success: true,

    message:
      "Registration submitted successfully. Your payment is pending verification.",

    exhibitorId:
      exhibitorId,

    paymentId:
      paymentId,

    exhibitorType:
      exhibitorType,

    amountPaid:
      amountPaid,

    requiredFee:
      0,

    receiptUploaded:
      receiptResult.uploaded || false,

    receiptUrl:
      receiptResult.viewUrl || "",

    downloadUrl:
      receiptResult.downloadUrl || "",

    confirmationUrl:
      confirmationUrl

  };
}


// ============================================================
// 33. TEST DASHBOARD
// ============================================================

function testDashboardStats() {

  var result =
    getDashboardStats();

  Logger.log(

    JSON.stringify(

      result,

      null,

      2

    )

  );

  return result;
}


// ============================================================
// 34. TEST VISITOR DASHBOARD
// ============================================================

function testVisitorDashboardStats() {

  var result =
    getVisitorDashboardStats();

  Logger.log(

    JSON.stringify(

      result,

      null,

      2

    )

  );

  return result;
}


// ============================================================
// 35. COMPLETE SYSTEM TEST
// ============================================================

function testSystem() {

  var result = {

    settings:
      getSettings(),

    registrationFee:
      getRegistrationFee(),

    premiumSpaceFee:
      getPremiumSpaceFee(),

    paymentStats:
      getDashboardStats(),

    visitorStats:
      getVisitorDashboardStats(),

    eventInfo:
      getEventInfo()

  };

  Logger.log(

    JSON.stringify(

      result,

      null,

      2

    )

  );

  return result;
}
// ============================================================
// NEXTGEN EXPO 2026 - EXHIBITOR QR BADGE SYSTEM
// ADD THIS SECTION TO THE BOTTOM OF YOUR EXISTING CODE.GS
// ============================================================


// ============================================================
// 1. GET EXHIBITOR QR BADGE DATA
// ============================================================

function getExhibitorBadge(exhibitorId) {

  var sheet = getSheet(SHEET_NAMES.EXHIBITORS);

  var data = sheet
    .getDataRange()
    .getDisplayValues();

  exhibitorId = String(exhibitorId || "")
    .trim()
    .toUpperCase();

  if (!exhibitorId) {

    return {
      success: false,
      message: "Exhibitor ID is required."
    };
  }

  for (var i = 1; i < data.length; i++) {

    var currentId = String(data[i][1] || "")
      .trim()
      .toUpperCase();

    if (currentId === exhibitorId) {

      var qrValue = String(data[i][1]).trim();

      var qrImageUrl =
        "https://quickchart.io/qr?text=" +
        encodeURIComponent(qrValue) +
        "&size=300";

      return {

        success: true,

        exhibitorId: data[i][1],

        fullName: data[i][2] || "",

        phone: data[i][3] || "",

        email: data[i][4] || "",

        exhibitorType:
          normalizeExhibitorType(data[i][5]),

        businessName: data[i][6] || "",

        amountPaid: data[i][7] || "",

        mpesaCode: data[i][8] || "",

        paymentStatus: data[i][9] || "",

        checkInStatus:
          data[i][10] || "Not Checked In",

        notes: data[i][11] || "",

        spaceDescription: data[i][12] || "",

        boothNumber:
          findBoothForExhibitor(data[i][1]) ||
          "Not Assigned",

        qrValue: qrValue,

        qrImageUrl: qrImageUrl
      };
    }
  }

  return {

    success: false,

    message: "Exhibitor not found."
  };
}


// ============================================================
// 2. GET EXHIBITOR FROM QR VALUE
// ============================================================

function getExhibitorByQR(qrValue) {

  qrValue = String(qrValue || "")
    .trim()
    .toUpperCase();

  if (!qrValue) {

    return {

      success: false,

      message: "QR code is empty."
    };
  }

  return getExhibitorForCheckIn(qrValue);
}


// ============================================================
// 3. VERIFY EXHIBITOR QR
// ============================================================

function verifyExhibitorQR(qrValue) {

  qrValue = String(qrValue || "")
    .trim()
    .toUpperCase();

  if (!qrValue) {

    return {

      success: false,

      message: "No QR value supplied."
    };
  }

  var exhibitor =
    getExhibitorForCheckIn(qrValue);

  if (!exhibitor.success) {

    return {

      success: false,

      message:
        "This QR code does not belong to a registered exhibitor."
    };
  }

  return {

    success: true,

    exhibitor: exhibitor,

    message:
      "Exhibitor QR verified successfully."
  };
}


// ============================================================
// 4. CHECK IN EXHIBITOR USING QR
// ============================================================

function checkInExhibitorByQR(
  qrValue,
  staffName
) {

  qrValue = String(qrValue || "")
    .trim()
    .toUpperCase();

  if (!qrValue) {

    return {

      success: false,

      message: "QR code is empty."
    };
  }

  return checkInExhibitor(
    qrValue,
    staffName || "Admin"
  );
}


// ============================================================
// 5. GENERATE QR CODE URL
// ============================================================

function generateExhibitorQRCode(
  exhibitorId
) {

  exhibitorId = String(exhibitorId || "")
    .trim();

  if (!exhibitorId) {

    return {

      success: false,

      message:
        "Exhibitor ID is required."
    };
  }

  return {

    success: true,

    value: exhibitorId,

    imageUrl:
      "https://quickchart.io/qr?text=" +
      encodeURIComponent(exhibitorId) +
      "&size=300"
  };
}


// ============================================================
// 6. GET ALL EXHIBITOR BADGES
// ============================================================

function getAllExhibitorBadges() {

  var sheet =
    getSheet(SHEET_NAMES.EXHIBITORS);

  var data =
    sheet
      .getDataRange()
      .getDisplayValues();

  var badges = [];

  for (var i = 1; i < data.length; i++) {

    if (!data[i][1]) {
      continue;
    }

    var exhibitorId =
      String(data[i][1]).trim();

    var qrImageUrl =
      "https://quickchart.io/qr?text=" +
      encodeURIComponent(exhibitorId) +
      "&size=300";

    badges.push({

      exhibitorId:
        exhibitorId,

      fullName:
        data[i][2] || "",

      businessName:
        data[i][6] || "",

      exhibitorType:
        normalizeExhibitorType(data[i][5]),

      amountPaid:
        data[i][7] || "",

      paymentStatus:
        data[i][9] || "",

      checkInStatus:
        data[i][10] ||
        "Not Checked In",

      boothNumber:
        findBoothForExhibitor(
          exhibitorId
        ) ||
        "Not Assigned",

      qrValue:
        exhibitorId,

      qrImageUrl:
        qrImageUrl
    });
  }

  return badges;
}


// ============================================================
// 7. COMPLETE EXHIBITOR BADGE PROFILE
// ============================================================

function getCompleteExhibitorBadge(
  exhibitorId
) {

  var badge =
    getExhibitorBadge(
      exhibitorId
    );

  if (!badge.success) {

    return badge;
  }

  return {

    success: true,

    badge: badge
  };
}


// ============================================================
// 8. TEST QR SYSTEM
// ============================================================

function testExhibitorQR(
  exhibitorId
) {

  var badge =
    getExhibitorBadge(
      exhibitorId
    );

  if (!badge.success) {

    return badge;
  }

  var verification =
    verifyExhibitorQR(
      badge.qrValue
    );

  return {

    success:
      verification.success,

    badge:
      badge,

    verification:
      verification,

    message:
      verification.success
        ? "QR system is working correctly."
        : "QR verification failed."
  };
}


// ============================================================
// END OF EXHIBITOR QR BADGE SYSTEM
// ============================================================