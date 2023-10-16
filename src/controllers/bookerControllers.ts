import express, { NextFunction, Request, Response, request } from "express";
import bookingFormModel from "../models/bookingFormModel";
import { FormStatus } from "../global/statusForm";
import { RequestMiddleware } from "../global/interface";
import { LocationService } from "../utils/aws.location";
import userModel from "../models/usermodel";
import moment from "moment";
import DriverModel from "../models/driverModel";

const BookingCar = async (
  req: RequestMiddleware,
  res: Response,
  next: NextFunction
) => {
  const {
    start_time,
    end_time,
    start_location,
    end_location,
    number_people,
    reason,
  } = req.body;

  const createForm = await bookingFormModel.create({
    start_time: new Date(start_time),
    end_time: new Date(end_time),
    start_location: start_location,
    end_location: end_location,
    status: FormStatus.WAIT.toString(),
    number_people: number_people,
    reason: reason,
    userId: req.userId,
    create_at: moment(),
    // calculateDistance:calculateDistance ,
    // calculateTime:calculateTime
  });
  res.send(createForm);
};

const getBookedForm = async (
  req: RequestMiddleware,
  res: Response,
  next: NextFunction
) => {
  const userId = req.userId

  const condition: any = {
    userId:userId ,
    status: FormStatus.BOOKED
  }
  const getListBooked = await bookingFormModel.find(condition)

  res.send({
    total : getListBooked.length,
    data: getListBooked
  })
}

const getFormByDay = async (
  req: RequestMiddleware,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.userId;
    // {
    //   status: FormStatus.WAIT.toString(),
    //   start_time: {
    //     $gt: new Date(req.body.start),
    //   },
    //   end_time: {
    //     $lt: new Date(req.body.end),
    //   },
    // }
    const condition: any = {
      userId: userId,
      status: FormStatus.WAIT,
    };
    if (req.body.start) {
      condition.start_time = {
        $gt: new Date(req.body.start),
      };
    }
    if (req.body.end) {
      condition.end_time = {
        $lt: new Date(req.body.end),
      };
    }

    const listWaitByDay = await bookingFormModel.find(condition);
    // if (listWaitByDay === null) {
    //   const condition: any = {
    //     userId: userId,
    //     status: FormStatus.WAIT,
    //   };
    //   const getWaitingForm = await bookingFormModel.find(condition);

    res.send({
      total: listWaitByDay.length,
      data: listWaitByDay,
    });
    // } else {
    //   res.send(listWaitByDay);
    // }
  } catch (error) {
    console.log("ERR: ", error);
    res.send(error);
  }
};

const getFormByDateCreateForm = async (
  req: RequestMiddleware,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.userId;
    // {
    //   status: FormStatus.WAIT.toString(),
    //   start_time: {
    //     $gt: new Date(req.body.start),
    //   },
    //   end_time: {
    //     $lt: new Date(req.body.end),
    //   },
    // }
    const condition: any = {
      userId: userId,
      status: FormStatus.WAIT,
    };
    if (req.body.start ) {
      condition.create_at = {
        $gt: new Date(req.body.start),
      };
    }
    if (req.body.end) {
      condition.create_at = {
        $lt: new Date(req.body.end),
      };
    }

    const listWaitByDay = await bookingFormModel.find(condition);
    // if (listWaitByDay === null) {
    //   const condition: any = {
    //     userId: userId,
    //     status: FormStatus.WAIT,
    //   };
    //   const getWaitingForm = await bookingFormModel.find(condition);

    res.send({
      total: listWaitByDay.length,
      data: listWaitByDay,
    });
    // } else {
    //   res.send(listWaitByDay);
    // }
  } catch (error) {
    console.log("ERR: ", error);
    res.send(error);
  }
};

const getFormHistory = async (
  req: RequestMiddleware,
  res: Response,
  next: NextFunction
) => {
  const getUserId = req.userId;
  const condition: any = {
    userId: getUserId,
  };

  const getFormUser = await bookingFormModel.find(condition);
  res.send({
    total: getFormUser.length,
    data: getFormUser,
  });
};

const getCompleteForm = async (
  req: RequestMiddleware,
  res: Response,
  next: NextFunction
) => {
  // const CompleteStatus = req.query.status

  const userId = req.userId;

  const condition: any = {
    userId: userId,
    status: FormStatus.COMPLETE,
  };
  const getCompleteForm = await bookingFormModel.find(condition);

  res.send({
    total: getCompleteForm.length,
    data: getCompleteForm,
  });
};

const GetCancelForm = async (
  req: RequestMiddleware,
  res: Response,
  next: NextFunction
) => {
  const userId = req.userId;
  const statusForm = FormStatus.CANCEL;

  const condition: any = {
    userId: userId,
    status: statusForm,
  };
  const GetCancelForm = await bookingFormModel.find(condition);
  console.log(GetCancelForm);

  res.send({
    total: GetCancelForm.length,
    data: GetCancelForm,
  });
};

const GetWaitingForm = async (
  req: RequestMiddleware,
  res: Response,
  next: NextFunction
) => {
  // const CompleteStatus = req.query.status

  const userId = req.userId;

  const condition: any = {
    userId: userId,
    status: FormStatus.WAIT,
  };
  const getWaitingForm = await bookingFormModel.find(condition);

  res.send({
    total: getCompleteForm.length,
    data: getCompleteForm,
  });
};

const GetBookedForm = async (
  req: RequestMiddleware,
  res: Response,
  next: NextFunction
) => {
  // const CompleteStatus = req.query.status

  const userId = req.userId;

  const condition: any = {
    userId: userId,
    status: FormStatus.BOOKED,
  };
  const getBookedForm = await bookingFormModel.find(condition);

  res.send({
    total: getBookedForm.length,
    data: getBookedForm,
  });
};

const GetInfoDriver = async (
  req: RequestMiddleware,
  res: Response,
  next: NextFunction
) => {
  const getidForm = req.params.id 

  const condition :any ={
    _id:getidForm ,
    status: FormStatus.BOOKED,
  }
  
  const getForm = await bookingFormModel.findOne(condition)
  if(getForm){

    const getIdDriver = getForm?.driverId
    const getInfoDriver = await DriverModel.findOne({_id:getIdDriver})
    res.send(getInfoDriver)
  }
  else{
    res.send('Error not found form or not found Driver')
  }

 
}

const getInfoUser = async (
  req: RequestMiddleware,
  res: Response,
  next: NextFunction
) => {
  const getUser = req.user;
  const getRole = req.role;
  console.log(getUser);

  const getProfile = await userModel.findOne(getUser);
  console.log(getProfile);
  res.send(getProfile);
};

const GetStatics = async (
  req: RequestMiddleware,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.userId;

    const now = new Date()
    const startOfJan = new Date(now.getFullYear(), 0, 1)
    const endOfJan = new Date(now.getFullYear(), 1, 1)
    // console.log("currentYear: ", now.getFullYear())
    // console.log("startOfJan: ", startOfJan)
    // console.log("endOfJan: ", endOfJan)
    const januaryData = await bookingFormModel.find({
      userId: userId,
      status: FormStatus.COMPLETE,
      end_time: {
        $gte: startOfJan ,
        // $gte: new Date(1672531200000),
        $lt: endOfJan,
        // $lt: new Date(1675209600000),
      },
    });

    const januaryDataCancel = await bookingFormModel.find({ //1
      userId: userId,
      status: FormStatus.CANCEL,
      end_time: {
        $gte: startOfJan ,
        $lt: endOfJan,   
      },
    });

    const startOfFebruary = new Date(now.getFullYear(), 1, 1)
    const endOfFebruary = new Date(now.getFullYear(), 2, 1)
    console.log(startOfFebruary)
    console.log(endOfFebruary)
    const FebruaryData = await bookingFormModel.find({
      userId: userId,
      status: FormStatus.COMPLETE,
      end_time: {
        $gte: startOfFebruary,
        $lt: endOfFebruary,
      },
    });

    const startOfFebruaryCancel = new Date(now.getFullYear(), 1, 1) // 2
    const endOfFebruaryCancel = new Date(now.getFullYear(), 2, 1)
    console.log(startOfFebruary)
    console.log(endOfFebruary)
    const FebruaryDataCancel = await bookingFormModel.find({
      userId: userId,
      status: FormStatus.CANCEL,
      end_time: {
        $gte: startOfFebruaryCancel,
        $lt: endOfFebruaryCancel,
      },
    });

    const startOfMarch = new Date(now.getFullYear(), 2, 1)
    const endOfMarch = new Date(now.getFullYear(), 3, 1)
    const MarchData = await bookingFormModel.find({
      userId: userId,
      status: FormStatus.COMPLETE,
      end_time: {
        $gte: startOfMarch,
        $lt: endOfMarch,
      },
    });

    const startOfMarchCancel = new Date(now.getFullYear(), 2, 1) // 3
    const endOfMarchCancel = new Date(now.getFullYear(), 3, 1)
    const MarchDataCancel = await bookingFormModel.find({
      userId: userId,
      status: FormStatus.CANCEL,
      end_time: {
        $gte: startOfMarchCancel,
        $lt: endOfMarchCancel,
      },
    });

    const startOfApril = new Date(now.getFullYear(), 2, 1) 
    const endOfApril = new Date(now.getFullYear(), 3, 1)
    const AprilData = await bookingFormModel.find({
      userId: userId,
      status: FormStatus.COMPLETE,
      end_time: {
        $gte: startOfApril,
        $lt: endOfApril,
      },
    });

    const startOfAprilCancel = new Date(now.getFullYear(), 2, 1) // 4
    const endOfAprilCancel = new Date(now.getFullYear(), 3, 1)
    const AprilDataCancel = await bookingFormModel.find({
      userId: userId,
      status: FormStatus.CANCEL,
      end_time: {
        $gte: startOfAprilCancel,
        $lt: endOfAprilCancel,
      },
    });

    const startOfMay = new Date(now.getFullYear(), 3, 1)
    const endOfMay = new Date(now.getFullYear(), 4, 1)
    const MayData = await bookingFormModel.find({
      userId: userId,
      status: FormStatus.COMPLETE,
      end_time: {
        $gte: startOfMay,
        $lt: endOfMay,
      },
    });

    const startOfMayCancel = new Date(now.getFullYear(), 3, 1) // 5
    const endOfMayCancel = new Date(now.getFullYear(), 4, 1)
    const MayDataCancel = await bookingFormModel.find({
      userId: userId,
      status: FormStatus.CANCEL,
      end_time: {
        $gte: startOfMayCancel,
        $lt: endOfMayCancel,
      },
    });

    const startOfJune = new Date(now.getFullYear(), 4, 1)
    const endOfJune = new Date(now.getFullYear(), 5, 1)
    console.log(startOfFebruary)
    console.log(endOfFebruary)
    const JuneData = await bookingFormModel.find({
      userId: userId,
      status: FormStatus.COMPLETE,
      end_time: {
        $gte: startOfJune,
        $lt: endOfJune,
      },
    });

    const startOfJuneCancel = new Date(now.getFullYear(), 4, 1) /// 6
    const endOfJuneCancel = new Date(now.getFullYear(), 5, 1)
    console.log(startOfFebruary)
    console.log(endOfFebruary)
    const JuneDataCancel = await bookingFormModel.find({
      userId: userId,
      status: FormStatus.CANCEL,
      end_time: {
        $gte: startOfJune,
        $lt: endOfJune,
      },
    });

    const startOfJuly = new Date(now.getFullYear(), 5, 1)
    const endOfJuly = new Date(now.getFullYear(), 6, 1)
    const JulyData = await bookingFormModel.find({
      userId: userId,
      status: FormStatus.COMPLETE,
      end_time: {
        $gte: startOfJuly,
        $lt: endOfJuly,
      },
    });

    const startOfJulyCancel = new Date(now.getFullYear(), 5, 1) // 7
    const endOfJulyCancel = new Date(now.getFullYear(), 6, 1)
    const JulyDataCancel= await bookingFormModel.find({
      userId: userId,
      status: FormStatus.CANCEL,
      end_time: {
        $gte: startOfJuly,
        $lt: endOfJuly,
      },
    });

    const startOfAugust = new Date(now.getFullYear(), 6, 1)
    const endOfAugust= new Date(now.getFullYear(), 7, 1)
    const AugustData = await bookingFormModel.find({
      userId: userId,
      status: FormStatus.COMPLETE,
      end_time: {
        $gte: startOfAugust,
        $lt: endOfAugust,
      },
    });

    const startOfAugustCancel = new Date(now.getFullYear(), 6, 1) // 8
    const endOfAugustCancel= new Date(now.getFullYear(), 7, 1)
    const AugustDataCancel= await bookingFormModel.find({
      userId: userId,
      status: FormStatus.CANCEL,
      end_time: {
        $gte: startOfAugust,
        $lt: endOfAugust,
      },
    });

    const startOfSeptember = new Date(now.getFullYear(), 7, 1)
    const endOfSeptember= new Date(now.getFullYear(), 8, 1)
    const SeptemberData = await bookingFormModel.find({
      userId: userId,
      status: FormStatus.COMPLETE,
      end_time: {
        $gte: startOfSeptember,
        $lt: endOfSeptember,
      },
    });

    const startOfSeptemberCancel = new Date(now.getFullYear(), 7, 1) // 9
    const endOfSeptemberCancel= new Date(now.getFullYear(), 8, 1)
    const SeptemberDataCancel = await bookingFormModel.find({
      userId: userId,
      status: FormStatus.CANCEL,
      end_time: {
        $gte: startOfSeptember,
        $lt: endOfSeptember,
      },
    });

    const startOfOctober = new Date(now.getFullYear(), 8, 2)
    const endOfOctober= new Date(now.getFullYear(), 9, 2)
    const OctoberData = await bookingFormModel.find({
      userId: userId,
      status: FormStatus.COMPLETE,
      end_time: {
        $gte: startOfOctober,
        $lt: endOfOctober,
      },
    });

    const startOfOctoberCancel = new Date(now.getFullYear(), 8, 2) // 10
    const endOfOctoberCancel= new Date(now.getFullYear(), 9, 2)
    const OctoberDataCancel = await bookingFormModel.find({
      userId: userId,
      status: FormStatus.CANCEL,
      end_time: {
        $gte: startOfOctober,
        $lt: endOfOctober,
      },
    });

    const startOfNovember = new Date(now.getFullYear(), 9, 2)
    const endOfNovember= new Date(now.getFullYear(), 10, 2)
    const NovemberData = await bookingFormModel.find({
      userId: userId,
      status: FormStatus.COMPLETE,
      end_time: {
        $gte: startOfNovember,
        $lt: endOfNovember,
      },
    });

    const startOfNovemberCancel = new Date(now.getFullYear(), 9, 2) // 11 
    const endOfNovemberCancel= new Date(now.getFullYear(), 10, 2)
    const NovemberDataCancel = await bookingFormModel.find({
      userId: userId,
      status: FormStatus.CANCEL,
      end_time: {
        $gte: startOfNovember,
        $lt: endOfNovember,
      },
    });

    const startOfDecember = new Date(now.getFullYear(), 10, 2)
    const endOfDecember= new Date(now.getFullYear(), 11, 2)
    const DecemberData = await bookingFormModel.find({
      userId: userId,
      status: FormStatus.COMPLETE,
      end_time: {
        $gte: startOfDecember,
        $lt: new Date(1704067200000),
      },
    });

    const startOfDecemberCancel = new Date(now.getFullYear(), 10, 2) //12 
    const endOfDecemberCancel= new Date(now.getFullYear(), 11, 2)
    const DecemberDataCancel= await bookingFormModel.find({
      userId: userId,
      status: FormStatus.CANCEL,
      end_time: {
        $gte: startOfDecember,
        $lt: new Date(1704067200000),
      },
    });

    const GetAllMonth = [
      januaryData.length,
      FebruaryData.length,
      MarchData.length,
      AprilData.length,
      MayData.length,
      JuneData.length,
      JulyData.length,
      AugustData.length,
      SeptemberData.length,
      OctoberData.length,
      NovemberData.length,
      DecemberData.length,
    ];

    const getFormCancel = [
      januaryDataCancel.length ,
      FebruaryDataCancel.length ,
      MarchDataCancel.length ,
      AprilDataCancel.length ,
      MayDataCancel.length ,
      JuneDataCancel.length ,
      JulyDataCancel.length ,
      AugustDataCancel.length ,
      SeptemberDataCancel.length ,
      OctoberDataCancel.length ,
      NovemberDataCancel.length ,
      DecemberDataCancel.length

    ]
   
    res.send([GetAllMonth , getFormCancel]
     );
  } catch (error) {
    res.send(error);
  }
};

export {
  GetWaitingForm,
  BookingCar,
  getFormHistory,
  getInfoUser,
  getCompleteForm,
  GetCancelForm,
  GetBookedForm,
  getFormByDay,
  GetStatics,
  getFormByDateCreateForm ,
  GetInfoDriver
};
