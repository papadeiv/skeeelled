import {
  Accordion,
  Col,
  Container,
  Row,
  Table,
  Form,
  FloatingLabel,
  Button,
  Image,
  Stack,
  Card,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { ListEntry, MyPagination, SearchBar } from "./";
// import "./List.css";
import "./stylesheet/List.css"; // scss file access
import { useContext, useEffect, useState } from "react";
import { GlobalStateContext } from "../GlobalStateProvider";

function HeaderColspan(scope) {
  switch (scope) {
    case "courses":
      return "4";
    case "questions":
      return "4";
    default:
      return "10";
  }
}

function ListDefault({ props }) {
  return (
    <>
      {props.rounded ? (
        <div
          className={
            "default-table-" + props.title.toLowerCase().replace(/\s/g, "-")
          }
        >
          <table className="list roundedList">
            <thead>
              <tr>
                <th className="listTitle" colSpan={HeaderColspan(props.scope)}>
                  {props.title}
                </th>
              </tr>
            </thead>
            <tbody className="list-body">
              {props.rows.map((r, i) => {
                return (
                  <ListEntry
                    key={i}
                    row={r}
                    scope={props.scope}
                    dotted={props.dotted}
                  />
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div
          className={
            "default-table-" + props.title.toLowerCase().replace(/\s/g, "-")
          }
        >
          <Table striped borderless hover className="list">
            <thead className="listTitle">
              <tr>
                <th colSpan={HeaderColspan(props.scope)}>{props.title}</th>
              </tr>
            </thead>
            <tbody>
              {props.rows.map((r, i) => (
                <ListEntry key={i} scope={props.scope} row={r} />
              ))}
            </tbody>
          </Table>
        </div>
      )}

      {/*/!*pagination for list longer that 10 item*!/*/}
      {/*{*/}
      {/*  entryCount > 10 ? <MyPagination*/}
      {/*  />: <></>*/}
      {/*}*/}
    </>
  );
}

function ListQuestions({ props }) {
  return (
    <>
      <h3 className="listQuestionsTitle">{props.title}</h3>
      <SearchBar apiCall={{ scope: "questions" }} />
      {props.rows.map((r, i) => (
        <ListEntry key={i} scope={props.scope} row={r} />
      ))}
    </>
  );
}

function ListBookmarkQuestions({ props }) {
  return (
    <>
      <h3 className="listQuestionsTitle">{props.title}</h3>
      <SearchBar apiCall={{ scope: "questions" }} />
      {props.rows.map((r, i) => (
        <ListEntry key={i} scope={props.scope} row={r} />
      ))}
    </>
  );
}

function ListAnswers({ props }) {
  return (
    <Container className="list listAnswers">
      <div>
        {props.rows.map((r, i) => (
          <ListEntry key={i} scope={props.scope} row={r} />
        ))}
      </div>
    </Container>
  );
}

function ListMyComments({ props }) {
  return (
    <>
      <h3 className="listMyCommentsTitle">{props.title}</h3>
      <hr />
      {props.rows.map((r) => (
        <ListEntry scope={props.scope} row={r} />
      ))}
    </>
  );
}

function ListReplies({ props }) {
  return (
    <>
      {props.rows.map((r) => (
        <ListEntry key={r.reply._id} scope={props.scope} row={r} />
      ))}
    </>
  );
}

function ListSuggestion({ props }) {
  return (
    <>
      <Container>
        <h3 className="list-suggestion-title">{props.title}</h3>
        <div className="listSuggestion-questions">
          <Stack gap={3}>
            {props.rows.map((r, i) => (
              <ListEntry key={i} scope={props.scope} row={r} />
            ))}
          </Stack>
        </div>
      </Container>
    </>
  );
}

function ListSimulationResult({ props }) {
  const [areAllAccordionItemsOpen, setAreAllAccordionItemsOpen] =
    useState(false);
  const [activeKeys, setActiveKeys] = useState([]);

  // when the boolean changes, either add all available activeKeys or remove them all
  useEffect(() => {
    if (areAllAccordionItemsOpen) {
      setActiveKeys(props.rows.map((row, index) => index));
    } else {
      setActiveKeys([]);
    }
  }, [areAllAccordionItemsOpen, props.rows]);

  // handle cases when user manually opens / closes all accordion items
  useEffect(() => {
    if (activeKeys.length === 0) {
      setAreAllAccordionItemsOpen(false);
    }
    if (activeKeys.length === props.rows.length) {
      setAreAllAccordionItemsOpen(true);
    }
  }, [activeKeys.length, props.rows.length]);

  const updateActiveKeys = (eventKeys) => {
    setActiveKeys(eventKeys);
  };

  return (
    <>
      <Container className="list-simulation-result">
        <Card className="accordion-header-card">
          <Card.Header>
            <Row>
              <Col>
                <h4 className="listSimulationResultTitle">Your Answers</h4>
              </Col>
              <Col className="col-md-2">
                <Button
                  className="btn-outline-success-simulation-result"
                  variant="outline-success"
                  value="Show/Close"
                  onClick={() => {
                    setAreAllAccordionItemsOpen(!areAllAccordionItemsOpen);
                  }}
                >
                  {areAllAccordionItemsOpen ? "Close All" : "Show All"}
                </Button>
              </Col>
            </Row>
          </Card.Header>
        </Card>
        <Row>
          <Accordion
            className="listSimulationResults"
            defaultActiveKey={[]}
            activeKey={activeKeys}
            onSelect={updateActiveKeys}
            alwaysOpen
          >
            {props.rows.map((row, index) => (
              <ListEntry
                key={index}
                scope={props.scope}
                row={row}
                accordionKey={index}
              />
            ))}
          </Accordion>
        </Row>
        <Card className="accordion-footer-card" />
      </Container>
    </>
  );
}

function ListSelection({ props }) {
  return (
    <FloatingLabel label={props.title}>
      <Form.Select aria-label="Selection" className="my-4">
        {props.rows.map((r, i) => (
          <ListEntry scope={props.scope} row={r} key={i} />
        ))}
      </Form.Select>
    </FloatingLabel>
  );
}

function List(props) {
  if (props.scope === "questions") return <ListQuestions props={props} />;
  if (props.scope === "bookmarks")
    return <ListBookmarkQuestions props={props} />;
  if (props.scope === "answers") return <ListAnswers props={props} />;
  if (props.scope === "myComments") return <ListMyComments props={props} />;
  if (props.scope === "replies") return <ListReplies props={props} />;
  if (props.scope === "suggestion") return <ListSuggestion props={props} />;
  if (props.scope === "simulationResult")
    return <ListSimulationResult props={props} />;
  if (props.scope === "selection") return <ListSelection props={props} />;
  return <ListDefault props={props} />;
}

export default List;
