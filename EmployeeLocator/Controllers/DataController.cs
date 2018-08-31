using EmployeeLocator.Models;
using EmployeeLocatorDataAccess;
using System.Web.Mvc;

namespace EmployeeLocator.Controllers
{
    public class DataController : Controller
    {
        public IEmployeeLocatorRepository _employeeRepository { get; set; }

        public DataController()
        {
            _employeeRepository = new EmployeeLocatorRepository(new FloorWalkerEntities());
        }

        [HttpGet]
        public JsonResult FindPersonOrLocationResult(string searchTerm)
        {
            var result = new Response
            {
                Data = _employeeRepository.FindPersonOrLocation(searchTerm),
                Status = ResponseStatus.SUCCESS
            };

            return Json(result);
        }

        [HttpGet]
        public JsonResult GetAvailablePlaces()
        {
            var result = new Response
            {
                Data = _employeeRepository.GetAvailablePlaces(),
                Status = ResponseStatus.SUCCESS
            };
            return Json(result);
        }

        [HttpGet]
        public JsonResult GetPaths()
        {
            var result = new Response
            {
                Data = _employeeRepository.GetPaths(),
                Status = ResponseStatus.SUCCESS
            };
            return Json(result);
        }
    }
}