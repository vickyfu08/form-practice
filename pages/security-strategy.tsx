import {
  Alert,
  Box,
  Button,
  Container,
  Divider,
  Grid,
  IconButton,
  Typography,
  OutlinedInput,
  Tab,
  Tabs,
  Snackbar,
} from "@mui/material";
import Header from "@/components/Header";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateValidationError, DesktopDatePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { useEffect, useMemo, useState } from "react";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import { v4 as uuidv4 } from "uuid";
import CustomTabPanel from "@/components/CustomTabPanel";
import CustomInput from "@/components/Form/CustomInput";
const MAX_OBJECTIVES = 3;
const MAX_KEY_MEASURES = 3;

interface ObjectiveProps {
  id: string;
  objective: string;
  startDate: Dayjs;
  endDate: Dayjs;
  keyMeasures: string[];
}

function Objective(props: {
  obj: ObjectiveProps;
  handleDeleteObj: (id: string) => void;
}) {
  const { obj, handleDeleteObj } = props;
  const [objFields, setObjFields] = useState<ObjectiveProps>(obj);
  const [errMsg, setErrMsg] = useState<string | null>();
  const [errPopUpOpen, setErrPopUpOpen] = useState<boolean>(false);
  const [endDateErr, setEndDateErr] = useState<DateValidationError | null>(
    null
  );
  const endDateErrMsg = useMemo(() => {
    switch (endDateErr) {
      case "minDate":
        return "Please select a date after the start date";
      default:
        break;
    }
  }, [endDateErr]);
  useEffect(() => {
    if (errMsg) setErrPopUpOpen(true);
  }, [errMsg]);

  const handleErrClose = () => {
    setErrPopUpOpen(false);
    setErrMsg(null);
  };
  const handleDeleteBtn = (id: string) => {
    // Delete it from UI
    handleDeleteObj(id);
    // Delete it from localStorage
    localStorage.removeItem(`obj${id}`);
  };
  const handleAddMeasure = () => {
    if (objFields.keyMeasures.length < MAX_KEY_MEASURES) {
      setObjFields({
        ...objFields,
        keyMeasures: objFields.keyMeasures.concat(""),
      });
    } else {
      setErrMsg(`Up to ${MAX_KEY_MEASURES} key measures`);
    }
  };
  const handleRemoveMeasure = (index: number) => {
    const copy = JSON.parse(JSON.stringify(objFields.keyMeasures));
    if (objFields.keyMeasures.length > 1) {
      copy.splice(index, 1);
      setObjFields({ ...objFields, keyMeasures: copy });
    } else {
      setErrMsg("Please add at least 1 key measure");
    }
  };
  const handleMeasures = (value: string, index: number) => {
    const copy = objFields.keyMeasures;
    copy[index] = value;
    setObjFields({ ...objFields, keyMeasures: copy });
  };
  const handleUpdate = (objFields: ObjectiveProps, id: string) => {
    if (!endDateErr) {
      localStorage.setItem(`obj${id}`, JSON.stringify(objFields));
    }
  };
  return (
    <Box
      component="form"
      sx={{ flexGrow: 1 }}
      p={{ xs: 2, md: 3 }}
      m={{ xs: 2 }}
      border={"1px solid #c4c4c4"}
      borderRadius={3}
    >
      <Grid container spacing={5}>
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          open={errPopUpOpen}
          autoHideDuration={2000}
          onClose={handleErrClose}
        >
          <Alert
            onClose={handleErrClose}
            severity="error"
            sx={{ width: "100%" }}
          >
            {errMsg}
          </Alert>
        </Snackbar>
        <Grid xs={12} md={6} item container alignContent={"flex-start"}>
          <CustomInput
            label="Objective"
            inputComponent={
              <OutlinedInput
                value={objFields.objective}
                onChange={(e) =>
                  setObjFields({ ...objFields, objective: e.target.value })
                }
                fullWidth={true}
              />
            }
          />
        </Grid>
        <Grid md={6} item container spacing={2}>
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="aus">
            <Grid md={6} item>
              <CustomInput
                label="Start Date"
                inputComponent={
                  <DesktopDatePicker
                    format="DD/MM/YYYY"
                    defaultValue={objFields.startDate}
                    onChange={(v) =>
                      setObjFields({ ...objFields, startDate: v ?? dayjs() })
                    }
                    slotProps={{ textField: { fullWidth: true } }}
                  />
                }
              />
            </Grid>
            <Grid md={6} item>
              <CustomInput
                label="End Date"
                inputComponent={
                  <DesktopDatePicker
                    format="DD/MM/YYYY"
                    defaultValue={objFields.endDate}
                    minDate={objFields.startDate.add(1, "day")}
                    onChange={(v) =>
                      setObjFields({ ...objFields, endDate: v ?? dayjs() })
                    }
                    onError={(newError) => setEndDateErr(newError)}
                    slotProps={{
                      textField: { fullWidth: true, helperText: endDateErrMsg },
                    }}
                  />
                }
              />
            </Grid>
          </LocalizationProvider>
        </Grid>
        <Grid xs={12} md={6} item container alignItems={"baseline"}>
          <Grid xs={12} md={6} item justifyContent={"flex-start"}>
            <Typography>Key Measures</Typography>
          </Grid>
          <Grid xs={12} md={6} item container alignItems={"center"}>
            <Grid item md={9}>
              <Typography>Add addtional key measure</Typography>
            </Grid>
            <IconButton onClick={handleAddMeasure}>
              <AddCircleIcon color="primary" />
            </IconButton>
          </Grid>
          <Grid xs={12} md={12} item container spacing={1}>
            {objFields.keyMeasures.map((measure, index) => (
              <Grid key={index} xs={12} md={12} item container>
                <Grid item xs={11} md={11}>
                  <OutlinedInput
                    value={measure}
                    key={index}
                    onChange={(e) => {
                      handleMeasures(e.target.value, index);
                    }}
                    fullWidth={true}
                  />
                </Grid>
                <Grid item xs={1} md={1}>
                  <IconButton
                    onClick={() => handleRemoveMeasure(index)}
                    color="error"
                  >
                    <RemoveCircleIcon />
                  </IconButton>
                </Grid>
              </Grid>
            ))}
          </Grid>
        </Grid>
        <Grid
          item
          container
          display={"flex"}
          justifyContent={"flex-end"}
          spacing={2}
        >
          <Grid item>
            <Button
              variant="outlined"
              color="error"
              sx={{ textTransform: "unset" }}
              onClick={() => handleDeleteBtn(obj.id)}
            >
              Delete
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              sx={{ textTransform: "unset" }}
              onClick={() => handleUpdate(objFields, obj.id)}
            >
              Update
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}
function Objectives() {
  const [objs, setObjs] = useState<ObjectiveProps[]>([]);
  useEffect(() => {
    // Avoid hydration error as localStorage is on client side not server side
    setObjs(
      typeof window !== "undefined"
        ? Object.keys(localStorage)
            .filter((key) => key.includes("obj"))
            .map((key) => {
              let obj = JSON.parse(localStorage.getItem(key) ?? "");
              return {
                ...obj,
                startDate: dayjs(obj.startDate),
                endDate: dayjs(obj.endDate),
              };
            })
        : []
    );
  }, []);

  const handleAddObj = () => {
    if (objs.length < MAX_OBJECTIVES) {
      const emptyObj = {
        id: uuidv4(),
        objective: "",
        startDate: dayjs(),
        endDate: dayjs().add(1, "day"),
        keyMeasures: [""],
      };
      const newObj = JSON.parse(JSON.stringify(objs));
      newObj.push(emptyObj);
      setObjs(newObj);
      localStorage.setItem(`obj${emptyObj.id}`, JSON.stringify(emptyObj));
    }
  };
  const handleDeleteObj = (id: string) => {
    // Delete it from UI
    setObjs(objs.filter((obj) => obj.id !== id));
  };

  return (
    <Box component="form">
      {objs.map((obj) => (
        <Objective key={obj.id} obj={obj} handleDeleteObj={handleDeleteObj} />
      ))}
      <Grid container flex={"flex"} justifyContent={"flex-end"}>
        <Button
          variant="contained"
          sx={{ textTransform: "unset" }}
          onClick={() => handleAddObj()}
        >
          <AddCircleIcon sx={{ mr: 1 }} />
          Add Objectives
        </Button>
      </Grid>
    </Box>
  );
}

const SecurityStrategy = () => {
  return (
    <>
      <Header />
      <Box
        sx={{
          backgroundColor: "#f8f8f8",
          minHeight: "100vw",
          p: { xs: 1, md: 5 },
        }}
      >
        <Container maxWidth="xl">
          <Typography color={"primary"}>{`Set Security Strategy`}</Typography>
          <Divider sx={{ margin: "30px 0" }} />
          <Box>
            <Tabs
              value={1}
              textColor="primary"
              TabIndicatorProps={{ sx: { display: "none" } }}
              sx={{
                "& .MuiTabs-flexContainer": {
                  flexWrap: "wrap",
                },
              }}
            >
              <Tab
                label="Mission & Vision"
                disabled
                sx={{
                  backgroundColor: "#d7d7d7",
                  borderRadius: "12px 12px 0px 0px",
                  textTransform: "unset",
                }}
              ></Tab>
              <Tab
                label="Strategic Business Objectives"
                sx={{
                  backgroundColor: "White",
                  borderRadius: "12px 12px 0px 0px",
                  textTransform: "unset",
                }}
              ></Tab>
            </Tabs>
          </Box>
          <CustomTabPanel value={1} index={1}>
            <Objectives></Objectives>
          </CustomTabPanel>
        </Container>
      </Box>
    </>
  );
};
export default SecurityStrategy;
